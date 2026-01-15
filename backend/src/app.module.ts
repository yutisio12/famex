import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { getAuthDbConfig, getEmployeeDbConfig } from './config/database.config';
import { ExpenseModule } from './expense/expense.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { UserThrottlerGuard } from './throttlers/user-throttler.guard';

@Module({
  imports: [
    ExpenseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // Login Database Connection
    TypeOrmModule.forRootAsync({
      name: 'authConnection',
      imports: [ConfigModule],
      useFactory: getAuthDbConfig,
      inject: [ConfigService],
    }),
    // Employee Database Connection
    TypeOrmModule.forRootAsync({
      name: 'employeeConnection',
      imports: [ConfigModule],
      useFactory: getEmployeeDbConfig,
      inject: [ConfigService],
    }),
    CommonModule,
    AuthModule,
    ThrottlerModule.forRoot([
      {
        name: 'global',
        ttl: 60000,        // 60 detik
        limit: 100,     // 100 request / menit per IP
      },
      {
        name: 'user',
        ttl: 60000,
        limit: 30,
      },
    ]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      // useClass: ThrottlerGuard,
      useClass: UserThrottlerGuard,

    },
  ],
})
export class AppModule {}
