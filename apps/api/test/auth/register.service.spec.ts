import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Test } from '@nestjs/testing';

import { REGISTER_ERROR_CODES } from '@pcppb/shared';

import {
  REGISTER_ACCOUNT_PORT,
  type RegisterAccountPort,
} from '../../src/auth/register-account.port';
import { RegisterService } from '../../src/auth/register.service';

describe('RegisterService', () => {
  let service: RegisterService;
  let port: jest.Mocked<RegisterAccountPort>;

  beforeEach(async () => {
    port = {
      createRegisteredAccount: jest
        .fn<RegisterAccountPort['createRegisteredAccount']>()
        .mockImplementation(() => Promise.resolve()),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [RegisterService, { provide: REGISTER_ACCOUNT_PORT, useValue: port }],
    }).compile();

    service = moduleRef.get(RegisterService);
  });

  it('returns 201-shaped body on happy path', async () => {
    const result = await service.register('user@example.com', 'Pass!234');
    expect(result.accountId).toMatch(/^[0-9A-HJKMNP-TV-Z]{26}$/);
    expect(result.message).toContain('email');
    expect(port.createRegisteredAccount).toHaveBeenCalledTimes(1);
  });

  it('rejects invalid email', async () => {
    await expect(service.register('not-email', 'Pass!234')).rejects.toHaveProperty(
      'code',
      REGISTER_ERROR_CODES.INVALID_EMAIL,
    );
    expect(port.createRegisteredAccount).not.toHaveBeenCalled();
  });

  it('rejects invalid password', async () => {
    await expect(service.register('user@example.com', 'short')).rejects.toHaveProperty(
      'code',
      REGISTER_ERROR_CODES.INVALID_PASSWORD,
    );
    expect(port.createRegisteredAccount).not.toHaveBeenCalled();
  });
});
