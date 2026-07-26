import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { CyclePhaseSnapshotDto } from '@syna/shared-types';
import { Repository } from 'typeorm';

import { EmailService } from '../email/email.service';
import { UserEntity } from '../users/user.entity';

import {
  formatCyclePhaseEmailText,
  getCyclePhaseCopy,
} from './cycle-phase-copy';
import { PushService } from './push.service';

@Injectable()
export class CycleNotificationService {
  private readonly logger = new Logger(CycleNotificationService.name);

  constructor(
    private readonly emailService: EmailService,
    private readonly pushService: PushService,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async notifyPhaseChange(
    userId: string,
    snapshot: CyclePhaseSnapshotDto,
  ): Promise<void> {
    if (!snapshot.phase) {
      return;
    }

    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      return;
    }

    const copy = getCyclePhaseCopy(snapshot.phase, user.locale);

    try {
      await this.emailService.sendEmail({
        to: user.email,
        subject: copy.subject,
        text: formatCyclePhaseEmailText(copy, snapshot),
      });
    } catch (error) {
      this.logger.warn(
        `Cycle phase email failed for ${userId}: ${
          error instanceof Error ? error.message : 'unknown error'
        }`,
      );
    }

    await this.pushService.sendToUser(userId, {
      title: copy.pushTitle,
      body: copy.body,
      data: {
        type: 'cycle_phase',
        phase: snapshot.phase,
      },
    });
  }
}
