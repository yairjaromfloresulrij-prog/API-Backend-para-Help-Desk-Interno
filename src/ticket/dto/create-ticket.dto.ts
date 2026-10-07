import { IsEnum, IsInt, IsString } from 'class-validator';
import { Priority } from '../../generated/prisma/client.js';

export class CreateTicketDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(Priority)
  priority: Priority;

  @IsInt()
  categoryId: number;
}
