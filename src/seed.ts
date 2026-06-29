import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { UsersService } from './users/users.service.js';
import { HabitsService } from './habits/habits.service.js';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const usersService = app.get(UsersService);
  const habitsService = app.get(HabitsService);

  const user = await usersService.create({
    email: 'test@example.com',
    password: 'password123',
  });

  await habitsService.create(
    { name: 'Exercise', description: '30 min workout' },
    user.id,
  );
  await habitsService.create(
    { name: 'Read', description: 'Read 20 pages' },
    user.id,
  );
  await habitsService.create(
    { name: 'Meditate', description: '10 min meditation' },
    user.id,
  );

  console.log('Seed complete!');
  console.log(`User: test@example.com / password123`);
  console.log('Habits created: Exercise, Read, Meditate');

  await app.close();
}

void seed();
