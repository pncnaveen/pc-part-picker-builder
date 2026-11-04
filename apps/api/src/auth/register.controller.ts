import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ApiApplicationError } from '../infrastructure/http/api-application.error';
import { INVALID_REQUEST_ERROR } from './register.errors';
import { RegisterService } from './register.service';
import { ApiErrorResponseDto, RegisterRequestDto, RegisterResponseDto } from './register.types';

@ApiTags('auth')
@Controller('auth')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new account with email and password' })
  @ApiCreatedResponse({ type: RegisterResponseDto })
  @ApiBadRequestResponse({
    type: ApiErrorResponseDto,
    description: 'INVALID_REQUEST, INVALID_EMAIL, or INVALID_PASSWORD',
  })
  @ApiConflictResponse({
    type: ApiErrorResponseDto,
    description: 'EMAIL_ALREADY_REGISTERED',
  })
  @ApiServiceUnavailableResponse({ type: ApiErrorResponseDto })
  async register(@Body() body: RegisterRequestDto): Promise<RegisterResponseDto> {
    try {
      if (!body || typeof body.email !== 'string' || typeof body.password !== 'string') {
        throw INVALID_REQUEST_ERROR;
      }

      return await this.registerService.register(body.email, body.password);
    } catch (error) {
      if (error instanceof ApiApplicationError) {
        throw error.toHttpException();
      }
      throw error;
    }
  }
}
