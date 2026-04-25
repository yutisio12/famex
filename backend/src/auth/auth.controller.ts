import { Controller, Post, Body, Patch, Res, HttpStatus, UseGuards, Get, Req, NotFoundException, BadRequestException, Query } from "@nestjs/common";
import type { Response, Request } from "express";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { RolesGuard } from "./role.guard";
import { LoginDto } from "./dto/login.dto";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiCookieAuth, ApiBody } from "@nestjs/swagger";
import { PaginationQueryDto } from 'src/pagination/pagination-query.dto';
import { Not } from "typeorm";
import { Throttle } from '@nestjs/throttler';
import { Roles } from "./decorators/roles-decorator";

@ApiTags('Authentication')
@Controller('auth')
export class AuthController{
  constructor(private authService: AuthService){}

  @Post('login')
  @Throttle({ global: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Login User' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  async login(
    @Body() loginDto: LoginDto,
    @Res() response: Response,
  ){
    const user = await this.authService.validateUser(loginDto.username, loginDto.password)
    
    if(!user){
      return response.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Invalid Credentials!'
      })
    }

    const loginData = await this.authService.login(user)
    response.cookie('access_token', loginData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })

    return response.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      ...loginData
    })

  }

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 409, description: 'Username or email already exists' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: {
          type: 'string',
          example: 'johndoe',
          description: 'Username for login'
        },
        password: {
          type: 'string',
          example: 'password123',
          description: 'Password for login',
          minLength: 6
        },
        role: {
          type: 'number',
          example: 2,
          description: 'User role (1: admin, 2: user)',
          // required: false
        }
      },
      required: ['username', 'password']
    }
  })
  async register(
    @Body() registerDto: { username: string, password: string, name: string, role?: number },
  ) {
    const checkUsername = await this.authService.findOneCustom({ username: registerDto.username });
    if(checkUsername){
      return {
        statusCode: HttpStatus.CONFLICT,
        message: 'Username already exists, please use another username/email'
      }
    }
    return this.authService.register(registerDto);
  }

  @Post('validate')
  @UseGuards(JwtAuthGuard)
  async validate( @Req() req ){
    console.log(req)
  }

  @Post('logout')
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  async logout(@Res({passthrough: true}) response: Response){
    response.clearCookie('access_token')
    return { message: 'Logout Successfully' }
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({summary: 'Personal General Information'})
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async profile( @Req() req ){
    const profile = await this.authService.findOneCustom({id: req.user.id})
    if (!profile) {
      throw new NotFoundException('User not found');
    }
    const {id, password, ...result } = profile
    return result
  }

  @Patch('update_profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async update_profile( @Req() req, @Body() updateDTO: { name: string, face_id?: number[], status_active?: number } ){
    const profile = await this.authService.findOneCustom({id: req.user.id})

    if (!profile) {
      throw new NotFoundException('User not found');
    }
    
    const updating = await this.authService.updateUserByUser(req.user.id, updateDTO)

    return updating
  }

  @Patch('update_user')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  async update_user( @Body() updateDTO: { id: number, name: string, username?: string, face_id?: number[], status_active?: number } ){
    const profile = await this.authService.findOneCustom({id: updateDTO.id})
    if (!profile) {
      throw new NotFoundException('User not found');
    }

    const checkUsn = await this.authService.findOneCustom({
      username: updateDTO.username,
      id: Not(updateDTO.id)
    })
    
    if (checkUsn && typeof updateDTO.status_active == "undefined") {
      throw new BadRequestException('Username already exists, please use another username/email');
    }

    const { id, ...formData } = updateDTO
    const updating = await this.authService.updateUserByAdmin(id, formData)

    return updating
  }

  @Patch('update_password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async update_password( @Req() req, @Body() updateDTO: { current_password: string, new_password: string } ){
    const profile = await this.authService.findOneCustom({id: req.user.id})

    if (!profile) {
      throw new NotFoundException('User not found');
    }
    
    const updating = await this.authService.changePassword(req.user.id, updateDTO.current_password, updateDTO.new_password)

    return updating
  }

  @Post('face_login')
  @Throttle({ global: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  async face_login(
    @Body() loginDto: {faceDescriptor: number[]},
    @Res() response: Response,
  ){
    const inputDescriptor = loginDto.faceDescriptor
    if (!Array.isArray(inputDescriptor) || inputDescriptor.length !== 128) {
      throw new BadRequestException('Invalid face descriptor');
    }

    const loginData = await this.authService.face_login(inputDescriptor);
    // return response.status(HttpStatus.OK).json({
    //   statusCode: HttpStatus.OK,
    //   loginData
    // })

    if(!loginData){
      return response.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Invalid credentials'
      })
    }

    response.cookie('access_token', loginData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })

    return response.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      ...loginData
    })

  }

  @Get('user_list')
  @ApiOperation({ summary: 'Get User List' })
  @ApiResponse({ status: 200, description: 'User List' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1)
  findAll(@Query() query: PaginationQueryDto, ) {
    return this.authService.findAll(query);
  }

}
