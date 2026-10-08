import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service.js';
import { CommentsController } from './comments.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { NotificationModule } from '../notifications/notification.module.js';

@Module({
  imports: [PrismaModule, NotificationModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
