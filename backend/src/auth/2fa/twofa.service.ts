import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as QRCode from "qrcode";
import * as CryptoJS from 'crypto-js';
import { authenticator } from 'otplib';

@Injectable()
export class TwoFaService {
  private readonly encryptionKey: string;

  constructor(private configService: ConfigService) {
    this.encryptionKey = this.configService.get<string>('ENCRYPTION_KEY')
      ?? this.configService.get<string>('AES_SECRET_KEY')
      ?? '';

    authenticator.options = {
      step: 45,
      window: 1,
    };
  }

  generateSecret(username: string) {
    const secret = authenticator.generateSecret();
    const otpAuthUrl = authenticator.keyuri(username, 'Famex', secret);
    return { secret, otpAuthUrl };
  }

  async generateQRCode(otpauth: string) {
    return await QRCode.toDataURL(otpauth);
  }

  verifyToken(token: string, secret: string) {
    return authenticator.verify({ token, secret });
  }

  encryptSecret(secret: string){
    return CryptoJS.AES.encrypt(
      secret,
      this.encryptionKey
    ).toString();
  }

  decryptSecret(secret: string){
    return CryptoJS.AES.decrypt(
      secret,
      this.encryptionKey
    ).toString(CryptoJS.enc.Utf8);
  }

}
