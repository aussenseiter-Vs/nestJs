import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { CheckinsService } from './checkins.service.js';
import { CreateCheckInDto } from './dto/create-checkin.dto.js';
import { HabitsService } from '../habits/habits.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import type { RequestUser } from '../common/types.js';

@Controller('habits/:habitId/checkins')
@UseGuards(JwtAuthGuard)
export class CheckinsController {
  constructor(
    private readonly checkinsService: CheckinsService,
    private readonly habitsService: HabitsService,
  ) {}

  @Post()
  async create(
    @Param('habitId') habitId: string,
    @Body() dto: CreateCheckInDto,
    @CurrentUser() user: RequestUser,
  ) {
    await this.habitsService.findOne(+habitId, user.id);
    return this.checkinsService.create(+habitId, dto);
  }

  @Get()
  async findAll(
    @Param('habitId') habitId: string,
    @CurrentUser() user: RequestUser,
  ) {
    await this.habitsService.findOne(+habitId, user.id);
    return this.checkinsService.findAll(+habitId);
  }
}
