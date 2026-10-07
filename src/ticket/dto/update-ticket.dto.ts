import { PartialType } from '@nestjs/swagger';
import { CreateTicketDto } from './create-ticket.dto.js';
import { TicketStatus } from '../../generated/prisma/client.js';

export class UpdateTicketDto extends PartialType(CreateTicketDto) {
  status?: TicketStatus;
}
