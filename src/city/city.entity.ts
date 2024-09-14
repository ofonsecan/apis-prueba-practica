import { SupermarketEntity } from "src/supermarket/supermarket.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CityEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;
    
    @Column()
    country: string;
    
    @Column()
    population: number;

    @ManyToMany(() => SupermarketEntity, supermarket => supermarket.cities)
    @JoinTable()
    supermarkets: SupermarketEntity[];
}
