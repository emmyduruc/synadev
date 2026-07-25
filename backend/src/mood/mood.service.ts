import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type {
  MoodEntry,
  MoodLogMap,
  MoodLogs,
  ReplaceMoodLogs,
} from '@syna/shared-types';
import { DataSource, Repository } from 'typeorm';

import type { AuthenticatedClerkUser } from '../auth/auth.types';
import { UsersService } from '../users/users.service';

import { MoodEntryFeelingEntity } from './mood-entry-feeling.entity';
import { MoodEntryEntity } from './mood-entry.entity';

const toDateKey = (value: string | Date): string => {
  if (typeof value === 'string') {
    return value.slice(0, 10);
  }

  return value.toISOString().slice(0, 10);
};

const isMoodEntryEmpty = (entry: MoodEntry): boolean =>
  !entry.primaryMood &&
  entry.feelings.length === 0 &&
  entry.energy === 0 &&
  entry.stress === 0 &&
  entry.note.trim().length === 0;

const mapEntityToEntry = (entity: MoodEntryEntity): MoodEntry => ({
  primaryMood: (entity.primaryMoodId as MoodEntry['primaryMood']) ?? null,
  feelings: (entity.feelings ?? []).map(
    (feeling) => feeling.feelingId as MoodEntry['feelings'][number],
  ),
  energy: entity.energy,
  stress: entity.stress,
  note: entity.note,
});

@Injectable()
export class MoodService {
  constructor(
    @InjectRepository(MoodEntryEntity)
    private readonly moodEntriesRepository: Repository<MoodEntryEntity>,
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
  ) {}

  async listLogs(clerkUser: AuthenticatedClerkUser): Promise<MoodLogs> {
    const userId = await this.usersService.resolveUserId(clerkUser);
    const rows = await this.moodEntriesRepository.find({
      where: { userId },
      order: { logDate: 'ASC' },
    });

    const logs: MoodLogMap = {};

    for (const row of rows) {
      logs[toDateKey(row.logDate)] = mapEntityToEntry(row);
    }

    return { logs };
  }

  async replaceLogs(
    clerkUser: AuthenticatedClerkUser,
    input: ReplaceMoodLogs,
  ): Promise<MoodLogs> {
    const userId = await this.usersService.resolveUserId(clerkUser);

    const cleanedEntries = Object.entries(input.logs).filter(
      ([, entry]) => !isMoodEntryEmpty(entry),
    );

    await this.dataSource.transaction(async (manager) => {
      await manager.delete(MoodEntryEntity, { userId });

      for (const [logDate, entry] of cleanedEntries) {
        const feelings = [...new Set(entry.feelings)].filter(
          (feelingId) => feelingId !== entry.primaryMood,
        );

        const moodEntry = manager.create(MoodEntryEntity, {
          userId,
          logDate,
          primaryMoodId: entry.primaryMood,
          energy: entry.energy,
          stress: entry.stress,
          note: entry.note.trim(),
          feelings: feelings.map((feelingId) =>
            manager.create(MoodEntryFeelingEntity, { feelingId }),
          ),
        });

        await manager.save(moodEntry);
      }
    });

    const logs: MoodLogMap = {};

    for (const [logDate, entry] of cleanedEntries) {
      logs[logDate] = {
        ...entry,
        feelings: [...new Set(entry.feelings)].filter(
          (feelingId) => feelingId !== entry.primaryMood,
        ),
        note: entry.note.trim(),
      };
    }

    return { logs };
  }
}
