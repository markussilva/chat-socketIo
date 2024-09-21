import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface MessagePayload {
  author: string;
  message: string;
}

@WebSocketGateway({
  cors: {
    origin: '*', // ou seu domínio específico que for necessarorio
    credentials: true,
  },
})
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: Server;

  private messages: MessagePayload[] = []; // Armazena mensagens
  private users: { id: string; username: string }[] = []; // Armazena usuários conectados

  handleConnection(client: Socket) {
    console.log('User connected:', client.id);
    // Adiciona o usuário à lista (você pode pedir o nome do usuário aqui)
    this.users.push({
      id: client.id,
      username: `User${this.users.length + 1}`,
    });
    this.server.emit('userList', this.users); // Emite a lista de usuários para todos
  }

  handleDisconnect(client: Socket) {
    console.log('User disconnected:', client.id);
    // Remove o usuário da lista quando desconectar
    this.users = this.users.filter((user) => user.id !== client.id);
    this.server.emit('userList', this.users); // Atualiza a lista de usuários
  }

  afterInit(server: Server) {
    console.log('Socket is live');
  }

  @SubscribeMessage('sendmessage')
  handleEvent(client: Socket, payload: MessagePayload): void {
    console.log(payload);
    this.server.emit('message', payload); // Emite a mensagem para todos os clientes conectados
    // Se quiser enviar apenas para outros clientes, use:
    // client.broadcast.emit('message', payload);

    // Para adicionar lógica de persistência, você pode armazenar as mensagens em um array ou banco de dados aqui.
  }
}
