import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { CommentsService } from './comments.service.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('tickets/:ticketId/comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(
    @Param('ticketId', ParseIntPipe) ticketId: number,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: Request,
  ) {
    const user = req.user as {
      sub: number;
      role: string;
    };

    return this.commentsService.create(
      ticketId,
      createCommentDto,
      user.sub,
      user.role,
    );
    }
  @Get('ticket/:ticketId')
  @UseGuards(JwtAuthGuard)
  findHistorial(
    @Param('ticketId', ParseIntPipe) ticketId: number,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.commentsService.findHistorial(
      ticketId,
      request.user.id,
      request.user.role,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(+id);
  }

  @Get()
  findAll(
    @Param('ticketId', ParseIntPipe) ticketId: number,
    @Req() req: Request,
  ) {
    const user = req.user as {
      sub: number;
      role: string;
    };

    return this.commentsService.findAll(
      ticketId,
      user.sub,
      user.role,
    );
  }
}