import { Injectable } from "@nestjs/common";
import * as QRCode from "qrcode";
import * as CryptoJS from 'crypto-js';
import { authenticator } from 'otplib';

@Injectable()
export class TwoFaService {
  constructor() {
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
      process.env.ENCRYPTION_KEY || 'superSecretKey'
    ).toString();
  }

  decryptSecret(secret: string){
    return CryptoJS.AES.decrypt(
      secret, 
      process.env.ENCRYPTION_KEY || 'superSecretKey'
    ).toString(CryptoJS.enc.Utf8);
  }

}
