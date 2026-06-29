import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { HabitsService } from './habits.service.js';
import { CreateHabitDto } from './dto/create-habit.dto.js';
import { UpdateHabitDto } from './dto/update-habit.dto.js';
import { CheckinsService } from '../checkins/checkins.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import type { RequestUser } from '../common/types.js';

@Controller('habits')
@UseGuards(JwtAuthGuard)
export class HabitsController {
  constructor(
    private readonly habitsService: HabitsService,
    private readonly checkinsService: CheckinsService,
  ) {}

  @Post()
  create(@Body() dto: CreateHabitDto, @CurrentUser() user: RequestUser) {
    return this.habitsService.create(dto, user.id);
  }

  @Get()
  findAll(@CurrentUser() user: RequestUser) {
    return this.habitsService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.habitsService.findOne(+id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateHabitDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.habitsService.update(+id, dto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.habitsService.remove(+id, user.id);
  }

  @Get(':id/stats')
  async stats(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    await this.habitsService.findOne(+id, user.id);
    const streak = await this.checkinsService.getStreak(+id);
    const weeklyRate = await this.checkinsService.getWeeklyCompletionRate(+id);
    return { streak, weeklyCompletionRate: weeklyRate };
  }
}
