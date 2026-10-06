import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service.js';
import { CategoriesController } from './categories.controller.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Module({
  providers: [CategoriesService, PrismaService],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
