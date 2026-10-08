import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class AssignTicketDto {
  @ApiProperty({
    description: 'ID del agente al que se asignará el ticket',
    example: 2,
  })
  @IsInt()
  assignedToId: number;
}
