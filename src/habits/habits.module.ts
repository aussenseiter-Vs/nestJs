import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HabitsController } from './habits.controller.js';
import { HabitsService } from './habits.service.js';
import { Habit } from './habit.entity.js';
import { CheckinsModule } from '../checkins/checkins.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Habit]),
    forwardRef(() => CheckinsModule),
  ],
  controllers: [HabitsController],
  providers: [HabitsService],
  exports: [HabitsService],
})
export class HabitsModule {}
