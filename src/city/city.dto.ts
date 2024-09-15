import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CityDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;
    
    @IsString()
    @IsNotEmpty()
    readonly country: string;
    
    @IsInt()
    @IsNotEmpty()
    readonly population: number;
}
