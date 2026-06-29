import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckinsController } from './checkins.controller.js';
import { CheckinsService } from './checkins.service.js';
import { CheckIn } from './checkin.entity.js';
import { HabitsModule } from '../habits/habits.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([CheckIn]),
    forwardRef(() => HabitsModule),
  ],
  controllers: [CheckinsController],
  providers: [CheckinsService],
  exports: [CheckinsService],
})
export class CheckinsModule {}
