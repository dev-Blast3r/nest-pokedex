import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {

  private defaultLimit: number;

  constructor(

    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService,

  ){
    // console.log( process.env.DEFAULT_LIMIT );
    this.defaultLimit = configService.get<number>('defaultLimit');
    console.log({ defaultLimit: configService.get<number>('defaultLimit') })
    // console.log( {defaultLimit} );
  }
  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      const pokemon= await this.pokemonModel.create( createPokemonDto );
      return pokemon;
      
    } catch (error) {
      if (error.code === 11000 ) {
        throw new BadRequestException(`Pokemon exist in DB ${ JSON.stringify( error.keyValue )}`);
      }
      
      console.log(error)
      throw new InternalServerErrorException(`Cant create Pokemon - Check server logs`);
    }
  }

  findAll( paginationDto: PaginationDto) {
    // return `This action returns all pokemon`;

    const { limit = this.defaultLimit, offset = 0 } = paginationDto;

    return this.pokemonModel.find()
    .limit( limit )
    .skip( offset )
    .sort({
      no: 1
    })
    .select('-__v');
  }

  async findOne(term: string) {
    let pokemon: Pokemon;

    if( !isNaN(+term) ){
      pokemon = await this.pokemonModel.findOne({ no: term });
    }

    //MongoID => el objeto term debe ser un mongo id (string)
    if ( !pokemon && isValidObjectId( term ) ) {
      pokemon = await this.pokemonModel.findById( term );
    }

    //Name
    if( !pokemon ) {
      pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase().trim() })
    }

    if ( !pokemon )
      throw new NotFoundException(`Pokemon with id, name or no "${ term }" not found`);

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne( term );

    if ( updatePokemonDto.name )
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

      try {
        await pokemon.updateOne( updatePokemonDto );
        return { ...pokemon.toJSON(), ...updatePokemonDto };

      } catch (error) {
        this.handleExceptions( error );
      }
      // const updatedPokemon = await pokemon.updateOne( updatePokemonDto, { new: true });
      
  }

  async remove(id: string) {
    // const pokemon = await this.findOne ( id );
    // // this.pokemonModel.findByIdAndDelete( id );
    // await pokemon.deleteOne();
    // const result = await this.pokemonModel.findByIdAndDelete( id );
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
    if ( deletedCount === 0 )
      throw new BadRequestException(`Pokemon with id "${ id }" not found`)
    return;
  }

  // Nota: excepciones no controladas
  private handleExceptions( error: any ) {
    if (error.code === 11000 ) {
      throw new BadRequestException(`Pokemon exist in DB ${ JSON.stringify( error.keyValue )}`);
    }
    
    console.log(error)
    throw new InternalServerErrorException(`Cant create Pokemon - Check server logs`);
  }
}
