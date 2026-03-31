import { Module } from '@nestjs/common';
import { TwoFaService } from './twofa.service';
import { TwoFaController } from './twofa.controller';

@Module({
  providers: [TwoFaService],
  controllers: [TwoFaController],
})
export class TwoFaModule {}