import { Module } from '@nestjs/common';
import { TicketController } from './ticket.controller.js';
import { TicketService } from './ticket.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { NotificationModule } from '../notifications/notification.module.js';

@Module({
  imports: [PrismaModule, NotificationModule],
  controllers: [TicketController],
  providers: [TicketService],
  exports: [TicketService],
})
export class TicketModule {}
