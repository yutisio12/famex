import {
  Controller,
  Post,
  Body,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { TwoFaService } from './twofa.service';

@Controller('auth/2fa')
export class TwoFaController {
  constructor(private readonly twoFaService: TwoFaService){}

  @Post('setup')
  async setup(@Body() body: {username: string}){
    const {secret, otpAuthUrl} = this.twoFaService.generateSecret(body.username);
    const qrCode = await this.twoFaService.generateQRCode(otpAuthUrl);
    return {qrCode, secret, otpAuthUrl};
  }

  @Post('verify-setup')
  async verifySetup(
    @Body() body: {
      token: string;
      secret: string;
      encryptedUserId: string;
    }
  ){
    const isValid = this.twoFaService.verifyToken(body.token, body.secret)
    if(!isValid){
      throw new UnauthorizedException('Invalid TOTP');
    }

    const encrypted = this.twoFaService.encryptSecret(body.secret);

    // 👉 simpan ke DB (TypeORM)
    // await this.userRepo.update(body.userId, {
    //   twoFactorSecret: encrypted,
    //   twoFactorEnabled: true,
    // });

    return {
      message: '2FA enabled',
    };
  }

  @Post('verify-login')
  async verifyLogin(
    @Body()
    body: {
      token: string;
      encryptedSecret: string;
    },
  ) {
    const secret =
      this.twoFaService.decryptSecret(
        body.encryptedSecret,
      );

    const isValid = this.twoFaService.verifyToken(
      body.token,
      secret,
    );

    if (!isValid) {
      throw new UnauthorizedException('Invalid TOTP');
    }

    return {
      message: 'Login success',
    };
  }

}