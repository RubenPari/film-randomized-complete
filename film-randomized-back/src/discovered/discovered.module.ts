import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscoveredItem } from '../entities/discovered-item.entity.js';
import { DiscoveredController } from './discovered.controller.js';
import { DiscoveredService } from './discovered.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([DiscoveredItem])],
  controllers: [DiscoveredController],
  providers: [DiscoveredService],
})
export class DiscoveredModule {}
