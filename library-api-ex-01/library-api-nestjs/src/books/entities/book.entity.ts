import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type BookDocument = Book & Document;

@Schema({ collection: 'Books' })
export class Book {
  _id: string;

  @Prop()
  name: string;

  @Prop()
  isbn: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Author' })
  author: string;
}

export const BookSchema = SchemaFactory.createForClass(Book);
