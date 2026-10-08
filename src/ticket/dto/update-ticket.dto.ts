import { PartialType } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { CreateTicketDto } from './create-ticket.dto.js';
import { TicketStatus } from '../../generated/prisma/client.js';

export class UpdateTicketDto extends PartialType(CreateTicketDto) {
  
  @IsEnum(TicketStatus)
  status?: TicketStatus;
}
