import { Module } from '@nestjs/common';
import { CitySupermarketService } from './city-supermarket.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityEntity } from 'src/city/city.entity';
import { SupermarketEntity } from 'src/supermarket/supermarket.entity';
import { CitySupermarketController } from './city-supermarket.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CityEntity, SupermarketEntity])],
  providers: [CitySupermarketService],
  controllers: [CitySupermarketController]
})
export class CitySupermarketModule {}
