import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { buildTypeOrmModuleOptions, parseDatabaseEnv } from './database.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => buildTypeOrmModuleOptions(parseDatabaseEnv()),
    }),
  ],
})
export class DatabaseModule {}
