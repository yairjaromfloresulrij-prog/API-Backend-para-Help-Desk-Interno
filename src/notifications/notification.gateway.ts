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
    const room = `user-${userId}`;

    client.join(room);

    return {
      event: 'usuarioRegistrado',
      data: {
        userId,
        room,
      },
    };
  }

  enviarNotificacion(userId: number, notification: unknown) {
    this.server
      .to(`user-${userId}`)
      .emit('notificacion', notification);
  }
}