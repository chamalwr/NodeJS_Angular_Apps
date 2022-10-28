import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { Author, AuthorDocument } from '../authors/entities/author.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book, BookDocument } from './entities/book.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name) private readonly bookModel: Model<BookDocument>,
    @InjectModel(Author.name)
    private readonly authorModel: Model<AuthorDocument>,
    @InjectPinoLogger(BooksService.name) private readonly logger: PinoLogger,
  ) {}
  async create(createBookDto: CreateBookDto) {
    this.logger.debug(
      `Creating a new book with payload ${JSON.stringify(createBookDto)}`,
    );
    const isAuthorExists = await this.authorModel.exists({
      _id: createBookDto.author,
    });
    if (isAuthorExists) {
      this.logger.debug('Selected author exist. Creating book');
      return await (
        await this.bookModel.create(createBookDto)
      ).populate('author');
    }
    this.logger.debug(`Failed to create book with payload ${JSON.stringify(
      createBookDto,
    )}. Because the author 
    is not exists!`);
    this.logger.warn(
      `Failed to create book, because the selected author is not exists`,
    );
    return undefined;
  }

  async findAll(page: number, take: number) {
    const totalBooks: number = await this.bookModel.count();
    const books = await this.bookModel
      .find()
      .limit(take * 1)
      .skip((page - 1) * take)
      .populate('author')
      .exec();
    if (books) {
      return {
        books,
        totalPages: Math.ceil(totalBooks / take),
        currentPage: Number(page),
      };
    }
    return { books, totalPages: 0, currentPage: Number(page) };
  }

  async findOne(id: string) {
    return await this.bookModel.findById(id).populate('author');
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    const isAuthorExists = await this.authorModel.exists({
      _id: updateBookDto.author,
    });
    if (isAuthorExists) {
      this.logger.debug('Selected author exist. Updating book');
      return await this.bookModel
        .findByIdAndUpdate(id, updateBookDto)
        .populate('author');
    }
    this.logger.debug(
      `Failed to update book Id ${id}. Since author does not exists on id ${updateBookDto.author}`,
    );
    return undefined;
  }
}
