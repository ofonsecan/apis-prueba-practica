import { CityEntity } from "../city/city.entity";
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
    website: string;

    @ManyToMany(() => CityEntity, city => city.supermarkets)
    cities: CityEntity[];
}
