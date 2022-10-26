import { Schema, model } from 'mongoose';
import { AuthorSchema } from './author-schema.js'

const BookSchema = new Schema({
    name:String,
    isbn:String,
    author: { type: Schema.Types.ObjectId, ref: 'author' }
});

const bookModel = model('book', BookSchema, 'Books');

export { BookSchema as BookSchema, bookModel as BookModel }