import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { TicketStatus } from '../../generated/prisma/client.js';

export class UpdateTicketStatusDto {
  @ApiProperty({
    description: 'Nuevo estado del ticket',
    enum: TicketStatus,
    example: TicketStatus.EN_PROCESO,
  })
  @IsEnum(TicketStatus)
  status: TicketStatus;
}
