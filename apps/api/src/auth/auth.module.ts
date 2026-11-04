import { Module } from '@nestjs/common';

import { PrismaRegisterAccountAdapter } from '../infrastructure/persistence/prisma-register-account.adapter';
import { REGISTER_ACCOUNT_PORT } from './register-account.port';
import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';

@Module({
  controllers: [RegisterController],
  providers: [
    RegisterService,
    PrismaRegisterAccountAdapter,
    { provide: REGISTER_ACCOUNT_PORT, useExisting: PrismaRegisterAccountAdapter },
  ],
})
export class AuthModule {}
