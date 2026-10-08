import {Injectable, Logger} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service.js';
import {NotificationGateway} from './notification.gateway.js';
import {NotificationType} from '../generated/prisma/enums.js';

@Injectable()
export class NotificationService {
    private readonly logger = new Logger(NotificationService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly gateway: NotificationGateway,
    ) {}


async enviar(userId: number, message: string, type: NotificationType, ticketId?: number) {
    try {
        const notification = await this.prisma.notification.create({
            data: {
                userId,
                message,
                type,
                ticketId,
            },
        });
        this.gateway.enviarNotificacion(userId, notification);
        return notification;
    } catch (error) {
        this.logger.error(
            `No se puede enviar la notificación al usuario ${userId}:`, 
            error instanceof Error ? error.stack : undefined,
        );
        return null;
    }
}
}