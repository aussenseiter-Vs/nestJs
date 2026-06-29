import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Habit } from './habit.entity.js';
import { CreateHabitDto } from './dto/create-habit.dto.js';
import { UpdateHabitDto } from './dto/update-habit.dto.js';

@Injectable()
export class HabitsService {
  constructor(
    @InjectRepository(Habit)
    private readonly habitsRepository: Repository<Habit>,
  ) {}

  async create(dto: CreateHabitDto, userId: number): Promise<Habit> {
    const habit = this.habitsRepository.create({ ...dto, userId });
    return this.habitsRepository.save(habit);
  }

  async findAll(userId: number): Promise<Habit[]> {
    return this.habitsRepository.find({ where: { userId } });
  }

  async findOne(id: number, userId: number): Promise<Habit> {
    const habit = await this.habitsRepository.findOne({ where: { id } });
    if (!habit) throw new NotFoundException('Habit not found');
    if (habit.userId !== userId) throw new ForbiddenException('Access denied');
    return habit;
  }

  async update(
    id: number,
    dto: UpdateHabitDto,
    userId: number,
  ): Promise<Habit> {
    const habit = await this.findOne(id, userId);
    Object.assign(habit, dto);
    return this.habitsRepository.save(habit);
  }

  async remove(id: number, userId: number): Promise<void> {
    const habit = await this.findOne(id, userId);
    await this.habitsRepository.remove(habit);
  }
}
