//HTTP endpoints - POST pub and POST sub

import { Controller, Post, Body } from '@nestjs/common';
import { QueueService } from './queue.service';
import { PublishMessageDto } from './dto/publish-message.dto';
import { ConsumeRequestDto } from './dto/consume-request.dto';

@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Post('publish')
  async publish(@Body() dto: PublishMessageDto) {
    await this.queueService.publish(dto.topic, dto.message);
    return { ok: true };
  }

  @Post('consume')
  async consume(@Body() dto: ConsumeRequestDto) {
    await this.queueService.consume(dto.topic);
    return { ok: true };
  }
}
