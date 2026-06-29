import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { CheckIn } from './checkin.entity.js';
import { CreateCheckInDto } from './dto/create-checkin.dto.js';

@Injectable()
export class CheckinsService {
  constructor(
    @InjectRepository(CheckIn)
    private readonly checkinsRepository: Repository<CheckIn>,
  ) {}

  async create(habitId: number, dto: CreateCheckInDto): Promise<CheckIn> {
    const today = new Date().toISOString().split('T')[0];
    const existing = await this.checkinsRepository.findOne({
      where: { habitId, date: today },
    });
    if (existing) throw new ConflictException('Already checked in today');

    const checkin = this.checkinsRepository.create({
      habitId,
      date: today,
      ...dto,
    });
    return this.checkinsRepository.save(checkin);
  }

  async findAll(habitId: number): Promise<CheckIn[]> {
    return this.checkinsRepository.find({
      where: { habitId },
      order: { date: 'DESC' },
    });
  }

  async getStreak(habitId: number): Promise<number> {
    const checkins = await this.checkinsRepository.find({
      where: { habitId },
      order: { date: 'DESC' },
    });

    if (checkins.length === 0) return 0;

    const today = new Date().toISOString().split('T')[0];
    const todayDate = new Date(today);

    let streak = 0;
    const startDate = todayDate;

    if (checkins[0].date !== today) {
      startDate.setDate(startDate.getDate() - 1);
    }

    for (let i = 0; i < checkins.length; i++) {
      const expected = new Date(startDate);
      expected.setDate(expected.getDate() - streak);
      const expectedStr = expected.toISOString().split('T')[0];

      if (checkins[i].date === expectedStr) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  async getWeeklyCompletionRate(habitId: number): Promise<number> {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const start = sevenDaysAgo.toISOString().split('T')[0];

    const count = await this.checkinsRepository.count({
      where: {
        habitId,
        date: MoreThanOrEqual(start),
      },
    });

    return count / 7;
  }
}
