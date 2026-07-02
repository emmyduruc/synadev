import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { SWAGGER_TAGS } from '../swagger/swagger.constants';

import { HealthResponseDto } from './dto/health.dto';

@ApiTags(SWAGGER_TAGS.health)
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({
    summary: 'Health check',
    description:
      'Returns the current health status, server timestamp, and API version. ' +
      'Use this endpoint for load balancer and uptime monitoring.',
  })
  @ApiOkResponse({
    description: 'Service is healthy and responding',
    type: HealthResponseDto,
  })
  check(): HealthResponseDto {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '0.0.1',
    };
  }
}
