import { Priority } from '../../generated/prisma/client.js';

export class CreateTicketDto {
  title: string;
  description: string;
  priority: Priority;
  categoryId: number;
}
