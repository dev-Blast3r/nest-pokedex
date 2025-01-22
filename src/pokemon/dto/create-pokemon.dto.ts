import { IsInt, IsPositive, IsString, MinLength } from "class-validator";

export class CreatePokemonDto {
    
    // isInt, is Positive, min1
    @IsInt()
    @IsPositive()
    @MinLength(1)
    no: number;

    // isString, min 1
    @IsString()
    @MinLength(1)
    name: string;

}
