import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PayosService } from './payos.service';
import { PaymentsController } from './payments.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, PayosService],
})
export class PaymentsModule {}
