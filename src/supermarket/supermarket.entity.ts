import { CityEntity } from "src/city/city.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SupermarketEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;
    
    @Column()
    longitude: number;
    
    @Column()
    latitude: number;

    @Column()
    web: string;

    @ManyToMany(() => CityEntity, city => city.supermarkets)
    cities: CityEntity[];
}
