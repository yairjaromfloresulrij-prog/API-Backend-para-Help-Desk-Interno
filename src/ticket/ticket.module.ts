import { Module } from '@nestjs/common';
import { TicketController } from './ticket.controller.js';
import { TicketService } from './ticket.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule {}
