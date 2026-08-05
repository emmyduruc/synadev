import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

import { AssessmentAnswerEntity } from './assessment-answer.entity';
import { AssessmentSubmissionEntity } from './assessment-submission.entity';
import { AssessmentsController } from './assessments.controller';
import { AssessmentsService } from './assessments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AssessmentSubmissionEntity, AssessmentAnswerEntity]),
    AuthModule,
    UsersModule,
  ],
  controllers: [AssessmentsController],
  providers: [AssessmentsService],
  exports: [AssessmentsService],
})
export class AssessmentsModule {}
