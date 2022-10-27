import { Schema, model } from 'mongoose';

const AuthorSchema = new Schema({
    firstName: String,
    lastName: String,
});

const authorModel = model('author', AuthorSchema, 'Authors');

export { authorModel as AuthorModel, AuthorSchema as AuthorSchema }