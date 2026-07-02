import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AppService } from './app.service';
import { SWAGGER_TAGS } from './swagger/swagger.constants';

@ApiTags(SWAGGER_TAGS.app)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Root greeting',
    description: 'Returns a simple greeting to confirm the API is reachable.',
  })
  @ApiOkResponse({
    description: 'Plain-text greeting message',
    schema: {
      type: 'string',
      example: 'Hello World!',
    },
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
