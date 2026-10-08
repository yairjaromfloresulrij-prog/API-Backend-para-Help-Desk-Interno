import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module.js";
import { NotificationService } from "./notification.service.js";
import { NotificationGateway } from "./notification.gateway.js";

@Module({
    imports: [PrismaModule],
    providers: [NotificationService, NotificationGateway],
    exports: [NotificationService, NotificationGateway],
})
export class NotificationModule {}