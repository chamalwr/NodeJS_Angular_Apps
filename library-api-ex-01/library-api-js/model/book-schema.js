import { Schema, model } from 'mongoose';
import { AuthorSchema } from './author-schema'

const BookSchema = new Schema({
    name:String,
    isbn:String,
    author: AuthorSchema,
});

const bookModel = model('book', BookSchema, 'Books');

export { BookSchema, bookModel }