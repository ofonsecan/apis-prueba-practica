import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CityModule } from './city/city.module';
import { SupermarketModule } from './supermarket/supermarket.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityEntity } from './city/city.entity';
import { SupermarketEntity } from './supermarket/supermarket.entity';
import { CitySupermarketModule } from './city-supermarket/city-supermarket.module';

@Module({
  imports: [CityModule, SupermarketModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'city',
      entities: [CityEntity, SupermarketEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true
    }),
    CitySupermarketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
