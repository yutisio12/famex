import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Not, IsNull } from "typeorm"
import { User } from "../entities/user.auth.entity";
import { JwtService } from "@nestjs/jwt";
import { EncryptionService } from "src/utils/encryption.service";
import { PaginationQueryDto } from 'src/pagination/pagination-query.dto';
import { PaginationResponseDto } from 'src/pagination/pagination-response.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User, 'authConnection')
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private encryptionService: EncryptionService
  ){}

  async validateUser(username: string, password: string): Promise<any>{
    const user = await this.userRepository.findOne({
      where: [{ username }]
    })

    if(user && await bcrypt.compare(password, user.password)){
      const { password, ...result} = user;
      return result;
    }
    return null;
  }

  async validateUserById(userId: number): Promise<any>{
    const user = await this.userRepository.findOne({
      where: [{ id:userId }]
    })

    if(user){
      const { password, ...result} = user;
      return result;
    }
    return null;
  }

  async login(user:any){
    const payload = { username: user.username, sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload)

    const encryptUserinfo = this.encryptionService.encryptObject({
      id: user.id,
      username: user.username,
      role: user.role
    })

    return {
      access_token: token,
      user: encryptUserinfo,
      name: user.name
    }
  }

  async face_login(inputDescriptor:any){
    const users = await this.userRepository.find({
      where: {
        face_id: Not(IsNull()),
      },
      select: ['id', 'face_id', 'username', 'role'],
    });
    
    let bestMatch: User | null = null;
    let minDistance = Infinity;

    for (const user of users) {
      const storedDescriptor: number[] = user.face_id;

      const distance = this.euclideanDistance(inputDescriptor, storedDescriptor);

      if (distance < minDistance) {
        minDistance = distance;
        bestMatch = user;
      }
    }

    const THRESHOLD = 0.5;
    if (!bestMatch || minDistance > THRESHOLD) {
      throw new UnauthorizedException('Face not recognized');
    }

    // return bestMatch

    const payload = { username: bestMatch.username, sub: bestMatch.id, role: bestMatch.role };
    const token = this.jwtService.sign(payload)

    const encryptUserinfo = this.encryptionService.encryptObject({
      id: bestMatch.id,
      username: bestMatch.username,
      role: bestMatch.role
    })

    return {
      access_token: token,
      user: encryptUserinfo,
      name: bestMatch.name
    }

  }

  async register(formData: any){
    const passwordEnc = await bcrypt.hash(formData.password, 10)

    const user = this.userRepository.create({
      ...formData,
      password: passwordEnc
    })
    const insertedUser = await this.userRepository.save(user)
    // return insertedUser // for debug purpose
    const userObj = Array.isArray(insertedUser) ? insertedUser[0] : insertedUser;
    const { password, ...result } = userObj;
    return result
  }

  async findUserByeUsername(username: string): Promise<User | undefined>{
    const user = await this.userRepository.findOne({ where: { username } });
    return user === null ? undefined : user;
  }

  async findOneCustom(whereParam: object): Promise<User | undefined>{
    const user = await this.userRepository.findOne({where: whereParam});
    return user === null ? undefined : user;
  }

  async changePassword(id: number, currentPassword: string, newPassword: string): Promise<void>{
    const user  = await this.userRepository.findOne({ where: { id } })
    if(!user){
      throw new UnauthorizedException('User not found')
    }
    if(await bcrypt.compare(currentPassword, user.password)){
      const passwordEnc = await bcrypt.hash(newPassword, 10)
      await this.userRepository.update(id, { password: passwordEnc })
    } else {
      throw new UnauthorizedException('Current password is incorrect')
    }
  }

  async updateUserByUser(id: number, formData: Partial<User>){
    const user  = await this.userRepository.findOne({ where: { id } })
    if(!user){
      throw new UnauthorizedException('User not found')
    }

    // return formData // dont forget to comm

    Object.assign(user, formData);
    await this.userRepository.save(user)
    const encryptUserinfo = this.encryptionService.encryptObject({
      id: user.id,
      username: user.username,
      role: user.role
    })

    const payload = { username: user.username, sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload)

    return {
      access_token: token,
      user: encryptUserinfo
    }
  }

  async updateUserByAdmin(id: number, formData: Partial<User>): Promise<any>{
    const user  = await this.userRepository.findOne({ where: { id } })
    if(!user){
      throw new UnauthorizedException('User not found')
    }
    Object.assign(user, formData);
    await this.userRepository.save(user)
    return 'OK'
  }

  async findAll(query: PaginationQueryDto, customWhere?: Record<string, any>) {
    const {page, limit, sort, search} = query
    const where: any = {}

    const datadb = this.userRepository.createQueryBuilder('user')
    datadb.select(['user.id', 'user.username', 'user.name', 'user.role'])
    datadb.addSelect(
      'CASE WHEN user.face_id IS NOT NULL THEN 1 ELSE 0 END',
      'face_id'
    );
    datadb.where('user.status_active = 1')
    if(search){
      datadb.where('(username ILIKE :search OR name ILIKE :search)', {search: `%${search}%`})
    }
    if (customWhere) {
      Object.keys(customWhere).forEach((key) => {
        // Kalau value array, pakai IN
        if (Array.isArray(customWhere[key])) {
          datadb.andWhere(`user.${key} IN (:...${key})`, { [key]: customWhere[key] });
        } else {
          datadb.andWhere(`user.${key} = :${key}`, { [key]: customWhere[key] });
        }
      });
    }
    if(sort){
      const [sortBy, sortType] = sort.split(',')
      datadb.orderBy(`${sortBy}`, sortType.toUpperCase() === 'DESC' ? 'DESC' : 'ASC')
    }
    datadb.skip((page - 1) * limit).take(limit);
    let data = await datadb.getRawMany();
    data = data.map(r => ({
      id: r.user_id,
      username: r.user_username,
      name: r.user_name,
      role: r.user_role,
      face_id: r.face_id
    }));
    const total = await datadb.getCount();

    return new PaginationResponseDto(data, total, page, limit);
  }

  euclideanDistance(a: number[], b: number[]) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) {
      const diff = a[i] - b[i];
      sum += diff * diff;
    }
    return Math.sqrt(sum);
  }

}
