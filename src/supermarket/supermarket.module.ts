import { Module } from '@nestjs/common';
import { SupermarketService } from './supermarket.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupermarketEntity } from './supermarket.entity';
import { SupermarketController } from './supermarket.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SupermarketEntity])],
  providers: [SupermarketService],
  controllers: [SupermarketController]
})
export class SupermarketModule {}
