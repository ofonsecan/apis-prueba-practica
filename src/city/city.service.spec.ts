import { Test, TestingModule } from '@nestjs/testing';
import { CityService } from './city.service';
import { Repository } from 'typeorm';
import { CityEntity } from './city.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('CityService', () => {
  let service: CityService;
  let repository: Repository<CityEntity>;
  let citiesList: CityEntity[];
  const allowedCountries = ['Argentina', 'Ecuador', 'Paraguay'];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CityService],
    }).compile();

    service = module.get<CityService>(CityService);
    repository = module.get<Repository<CityEntity>>(getRepositoryToken(CityEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedDatabase = async () => {
    repository.clear();
    citiesList = [];
    for(let i = 0; i < 5; i++){
        const city: CityEntity = await repository.save({
        name: faker.location.city(),
        country: faker.helpers.arrayElement(allowedCountries),
        population: faker.number.int({ min: 1000, max: 100000000 })})
        citiesList.push(city);
    }
  }

  it('findAll should return all cities', async () => {
    const cities: CityEntity[] = await service.findAll();
    expect(cities).not.toBeNull();
    expect(cities).toHaveLength(citiesList.length);
  });

  it('findOne should return a city by id', async () => {
    const storedCity: CityEntity = citiesList[0];
    const city: CityEntity = await service.findOne(storedCity.id);
    expect(city).not.toBeNull();
    expect(city.name).toEqual(storedCity.name)
    expect(city.country).toEqual(storedCity.country)
    expect(city.population).toEqual(storedCity.population)
  });

  it('findOne should throw an exception for an invalid city', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The city with the given id was not found")
  });

  it('create should return a new city', async () => {
    const city: CityEntity = {
      id: "",
      name: faker.location.city(),
      country: faker.helpers.arrayElement(allowedCountries),
      population: faker.number.int({ min: 1000, max: 100000000 }),
      supermarkets: []
    }
 
    const newCity: CityEntity = await service.create(city);
    expect(newCity).not.toBeNull();
 
    const storedCity: CityEntity = await repository.findOne({where: {id: newCity.id}})
    expect(storedCity).not.toBeNull();
    expect(city.name).toEqual(storedCity.name)
    expect(city.country).toEqual(storedCity.country)
    expect(city.population).toEqual(storedCity.population)
  });

  it('update should modify a city', async () => {
    const city: CityEntity = citiesList[0];
    city.name = "New name";
    city.country = "Argentina";
    city.population = 2000000;
     const updatedCity: CityEntity = await service.update(city.id, city);
    expect(updatedCity).not.toBeNull();
     const storedCity: CityEntity = await repository.findOne({ where: { id: city.id } })
    expect(storedCity).not.toBeNull();
    expect(storedCity.name).toEqual(city.name)
    expect(storedCity.country).toEqual(city.country)
    expect(storedCity.population).toEqual(city.population)
  });

  it('update should throw an exception for an invalid city', async () => {
    let city: CityEntity = citiesList[0];
    city = {
      ...city, name: "New name", country: "Argentina", population: 2000000
    }
    await expect(() => service.update("0", city)).rejects.toHaveProperty("message", "The city with the given id was not found")
  });

  it('delete should remove a city', async () => {
    const city: CityEntity = citiesList[0];
    await service.delete(city.id);
     const deletedCity: CityEntity = await repository.findOne({ where: { id: city.id } })
    expect(deletedCity).toBeNull();
  });

  it('delete should throw an exception for an invalid city', async () => {
    const city: CityEntity = citiesList[0];
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The city with the given id was not found")
  });
});
