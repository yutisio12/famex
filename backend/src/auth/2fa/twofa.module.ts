import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TwoFaService } from './twofa.service';
import { TwoFaController } from './twofa.controller';

@Module({
  imports: [ConfigModule],
  providers: [TwoFaService],
  controllers: [TwoFaController],
})
export class TwoFaModule {}