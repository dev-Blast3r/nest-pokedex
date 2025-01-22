import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Pokemon extends Document{
    
    //id: stromg // Mongo me lo da
    @Prop({
        unique: true,
        index: true,
    })
    name: string;

    @Prop({
        unique: true,
        index: true,
    })
    no: number; // numero de pokemon

}
export const PokemonSchema = SchemaFactory.createForClass( Pokemon );
