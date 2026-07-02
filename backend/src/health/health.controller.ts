import { Controller, Get } from '@nestjs/common';

import { HealthResponseDto } from '../users/dto/user.dto';

@Controller('health')
export class HealthController {
  @Get()
  check(): HealthResponseDto {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '0.0.1',
    };
  }
}
