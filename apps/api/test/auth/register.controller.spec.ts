import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Test } from '@nestjs/testing';

import { REGISTER_ERROR_CODES } from '@pcppb/shared';

import { EMAIL_ALREADY_REGISTERED_ERROR } from '../../src/auth/register.errors';
import { RegisterController } from '../../src/auth/register.controller';
import { RegisterService } from '../../src/auth/register.service';
import type { RegisterRequestDto } from '../../src/auth/register.types';

describe('RegisterController', () => {
  let controller: RegisterController;
  let registerService: jest.Mocked<Pick<RegisterService, 'register'>>;

  beforeEach(async () => {
    registerService = {
      register: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [RegisterController],
      providers: [{ provide: RegisterService, useValue: registerService }],
    }).compile();

    controller = moduleRef.get(RegisterController);
  });

  it('returns 201 body from service', async () => {
    registerService.register.mockResolvedValue({
      accountId: '01ARZ3NDEKTSV4RRFFQ69G5FAV',
      message: 'Check your email to verify your account.',
    });

    const result = await controller.register({
      email: 'user@example.com',
      password: 'Pass!234',
    });

    expect(result.accountId).toBe('01ARZ3NDEKTSV4RRFFQ69G5FAV');
  });

  it('maps invalid request body to HttpException', async () => {
    await expect(controller.register({} as RegisterRequestDto)).rejects.toMatchObject({
      response: { code: 'INVALID_REQUEST' },
    });
    expect(registerService.register).not.toHaveBeenCalled();
  });

  it('maps application errors to HttpException', async () => {
    registerService.register.mockRejectedValue(EMAIL_ALREADY_REGISTERED_ERROR);

    await expect(
      controller.register({ email: 'user@example.com', password: 'Pass!234' }),
    ).rejects.toMatchObject({
      response: { code: REGISTER_ERROR_CODES.EMAIL_ALREADY_REGISTERED },
    });
  });
});
