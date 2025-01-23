import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse } from './interfaces/poke-response.interface';
import { CreatePokemonDto } from '../pokemon/dto/create-pokemon.dto';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  
  // private readonly axios: AxiosInstance = axios;

  constructor(
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>,

    private readonly http: AxiosAdapter
  ){

  }

  async executeSeed() {

    await this.pokemonModel.deleteMany({}); // delete * from pokemon

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');

    const pokemonToInsert: { name: string, no: number }[] = [];

    data.results.forEach(async( { name, url } ) =>{

      const segments = url.split('/');
      const no = +segments[ segments.length -2 ];

      // const pokemon = await this.pokemonModel.create({ name, no });

      // nota: lo siguiente crea inserciones simultáneas
      pokemonToInsert.push({ name, no});
    });

    await this.pokemonModel.insertMany(pokemonToInsert);
    // Nota: este es un modo de hacer las cosas simultaneas
    // _________________________________________
    // const insertPromisesArray = [];
    // data.results.forEach(async( { name, url } ) =>{

    //   const segments = url.split('/');
    //   const no = +segments[ segments.length -2 ];

    //   // const pokemon = await this.pokemonModel.create({ name, no });

    //   // nota: lo siguiente crea inserciones simultáneas
    //   insertPromisesArray.push(
    //     this.pokemonModel.create({ name, no})
    //   );
    // });

    // await Promise.all( insertPromisesArray );
    // return `This action returns all seed Execute`;
    // return data.results;
    return 'Seed Executed';
  }


}
