import { ArgumentMetadata, Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {


  transform(value: string, metadata: ArgumentMetadata) {
    // console.log({value, metadata });
    if ( !isValidObjectId( value )) {
      throw new BadRequestException(`${ value } is a not mongo ID`);
    }
    return value; // para devolver los cambios en mayusculas
  }
}
