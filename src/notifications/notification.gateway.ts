import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class NotificationGateway {
    @WebSocketServer()
    server: Server;

    @SubscribeMessage('registrarUsuario')
    handleRegistrarUser(
        @MessageBody() userId: number,
        @ConnectedSocket() client: Socket,
    ) {
        client.join(`user-${userId}`);

         return {
        event: 'usuarioRegistrado',
        data: {
            userId,
        },
    };
    }
    enviarNotificacion(userId: number, notification: unknown) {
    this.server.to(`usuario:${userId}`).emit('notificacion', notification);
}
}


