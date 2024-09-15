import { Test, TestingModule } from '@nestjs/testing';
import { SupermarketService } from './supermarket.service';
import { Repository } from 'typeorm';
import { SupermarketEntity } from './supermarket.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker/.';

describe('SupermarketService', () => {
  let service: SupermarketService;
  let repository: Repository<SupermarketEntity>;
  let supermarketsList: SupermarketEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SupermarketService],
    }).compile();

    service = module.get<SupermarketService>(SupermarketService);
    repository = module.get<Repository<SupermarketEntity>>(getRepositoryToken(SupermarketEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedDatabase = async () => {
    repository.clear();
    supermarketsList = [];
    for(let i = 0; i < 5; i++){
        const supermarket: SupermarketEntity = await repository.save({
        name: faker.company.name() + ' Supermarket',
        longitude: faker.number.int({ min: -180, max: 180 }),
        latitude: faker.number.int({ min: -180, max: 180 }),
        website: faker.internet.url()})
        supermarketsList.push(supermarket);
    }
  }

  it('findAll should return all supermarkets', async () => {
    const supermarkets: SupermarketEntity[] = await service.findAll();
    expect(supermarkets).not.toBeNull();
    expect(supermarkets).toHaveLength(supermarketsList.length);
  });

  it('findOne should return a supermarket by id', async () => {
    const storedSupermarket: SupermarketEntity = supermarketsList[0];
    const supermarket: SupermarketEntity = await service.findOne(storedSupermarket.id);
    expect(supermarket).not.toBeNull();
    expect(supermarket.name).toEqual(storedSupermarket.name)
    expect(supermarket.longitude).toEqual(storedSupermarket.longitude)
    expect(supermarket.latitude).toEqual(storedSupermarket.latitude)
    expect(supermarket.website).toEqual(storedSupermarket.website)
  });

  it('findOne should throw an exception for an invalid supermarket', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The supermarket with the given id was not found")
  });

  it('create should return a new supermarket', async () => {
    const supermarket: SupermarketEntity = {
      id: "",
      name: faker.company.name() + ' Supermarket',
      longitude: faker.number.int({ min: -180, max: 180 }),
      latitude: faker.number.int({ min: -180, max: 180 }),
      website: faker.internet.url(),
      cities: []
    }
 
    const newSupermarket: SupermarketEntity = await service.create(supermarket);
    expect(newSupermarket).not.toBeNull();
 
    const storedSupermarket: SupermarketEntity = await repository.findOne({where: {id: newSupermarket.id}})
    expect(storedSupermarket).not.toBeNull();
    expect(supermarket.name).toEqual(storedSupermarket.name)
    expect(supermarket.longitude).toEqual(storedSupermarket.longitude)
    expect(supermarket.latitude).toEqual(storedSupermarket.latitude)
    expect(supermarket.website).toEqual(storedSupermarket.website)
  });

  it('update should modify a supermarket', async () => {
    const supermarket: SupermarketEntity = supermarketsList[0];
    supermarket.name = "New name - Supermarket";
    supermarket.longitude = 100;
    supermarket.latitude = 100;
    supermarket.website = "http://google.com";
     const updatedSupermarket: SupermarketEntity = await service.update(supermarket.id, supermarket);
    expect(updatedSupermarket).not.toBeNull();
     const storedSupermarket: SupermarketEntity = await repository.findOne({ where: { id: supermarket.id } })
    expect(storedSupermarket).not.toBeNull();
    expect(storedSupermarket.name).toEqual(supermarket.name)
    expect(supermarket.longitude).toEqual(storedSupermarket.longitude)
    expect(supermarket.latitude).toEqual(storedSupermarket.latitude)
    expect(supermarket.website).toEqual(storedSupermarket.website)
  });

  it('update should throw an exception for an invalid supermarket', async () => {
    let supermarket: SupermarketEntity = supermarketsList[0];
    supermarket = {
      ...supermarket, name: "New name - Supermarket", longitude: 100, latitude: 100, website: "http://google.com"
    }
    await expect(() => service.update("0", supermarket)).rejects.toHaveProperty("message", "The supermarket with the given id was not found")
  });

  it('delete should remove a supermarket', async () => {
    const supermarket: SupermarketEntity = supermarketsList[0];
    await service.delete(supermarket.id);
     const deletedSupermarket: SupermarketEntity = await repository.findOne({ where: { id: supermarket.id } })
    expect(deletedSupermarket).toBeNull();
  });

  it('delete should throw an exception for an invalid supermarket', async () => {
    const supermarket: SupermarketEntity = supermarketsList[0];
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The supermarket with the given id was not found")
  });
});
