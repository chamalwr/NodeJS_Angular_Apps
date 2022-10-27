import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type BookDocument = Book & Document;

@Schema({ collection: 'Books' })
export class Book {
    _id: string;

    @Prop()
    name: string;

    @Prop()
    isbn: string;

    @Prop()
    author: string;
}

export const BookSchema = SchemaFactory.createForClass(Book);
