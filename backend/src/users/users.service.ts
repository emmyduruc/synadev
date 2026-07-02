import { randomUUID } from 'crypto';

import { Injectable } from '@nestjs/common';
import type { CreateUser, User } from '@syna/shared-types';

@Injectable()
export class UsersService {
  private readonly users: User[] = [];

  create(input: CreateUser): User {
    const user: User = {
      id: randomUUID(),
      email: input.email,
      name: input.name,
      createdAt: new Date().toISOString(),
    };

    this.users.push(user);
    return user;
  }

  findAll(): User[] {
    return this.users;
  }
}
