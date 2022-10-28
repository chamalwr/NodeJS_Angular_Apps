import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type AuthorDocument = Author & Document;

@Schema({ collection: 'Authors' })
export class Author {
  _id: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;
}

export const AuthorSchema = SchemaFactory.createForClass(Author);
