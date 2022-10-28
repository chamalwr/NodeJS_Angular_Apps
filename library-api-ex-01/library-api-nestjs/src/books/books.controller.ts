import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
  InternalServerErrorException,
  Query,
  Put,
} from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller()
export class BooksController {
  constructor(
    private readonly booksService: BooksService,
    @InjectPinoLogger(BooksController.name) private readonly logger: PinoLogger,
  ) {}

  @Post('book')
  async create(@Body() createBookDto: CreateBookDto) {
    return await this.booksService
      .create(createBookDto)
      .then((result) => {
        if (result) {
          this.logger.debug(
            `New book created. result returned ${JSON.stringify(result)}`,
          );
          return result;
        }
        this.logger.warn(
          `Failed to create new book, Check the selected author exists!`,
        );
        throw new NotFoundException(
          `Failed to create new book, Check the selected author exists!`,
        );
      })
      .catch((error) => {
        this.logger.error(`Failed to create new book. Error ${error.message}`);
        throw new InternalServerErrorException(
          `Failed to create new book. Error ${error.message}`,
        );
      });
  }

  @Get('books')
  async findAll(@Query('page') page: number, @Query('take') take: number) {
    return await this.booksService
      .findAll(page, take)
      .then((result) => {
        if (result) {
          this.logger.debug(`Fetched books ${JSON.stringify(result)}`);
          return result;
        }
        this.logger.warn(
          `No books found. returned result as ${JSON.stringify(result)}`,
        );
        throw new NotFoundException(
          `No books found. returned result as ${JSON.stringify(result)}`,
        );
      })
      .catch((error) => {
        this.logger.error(
          `Error occured while getting all books Error ${error.message}`,
        );
        throw new InternalServerErrorException(error.message);
      });
  }

  @Get('book/:id')
  async findOne(@Param('id') id: string) {
    return await this.booksService
      .findOne(id)
      .then((result) => {
        if (result) {
          this.logger.debug(
            `Book found on ID ${id}. returned result ${JSON.stringify(result)}`,
          );
          return result;
        }
        this.logger.warn(`No book found on given ID of ${id}`);
        throw new NotFoundException(`No book found on given ID of ${id}`);
      })
      .catch((error) => {
        this.logger.error(
          `Failed to retrive book of id ${id} Error :${error.message}`,
        );
        throw new InternalServerErrorException(
          `Failed to retrive book. Error :${error.message}`,
        );
      });
  }

  @Put('book/:id')
  async update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService
      .update(id, updateBookDto)
      .then((result) => {
        if (result) {
          this.logger.debug(
            `Book id ${id} updated with the result ${JSON.stringify(result)}`,
          );
          return result;
        }
        this.logger.debug(
          `Updating book is failed on Book id ${id}. with payload ${JSON.stringify(
            updateBookDto,
          )}`,
        );
        this.logger.warn(
          `Updating Book Details failed, Book or Author does not exist`,
        );
        throw new NotFoundException(
          `Updating Book Details failed, Book or Author does not exist`,
        );
      })
      .catch((error) => {
        this.logger.debug(
          `Failed to update book id: ${id} with payload ${JSON.stringify(
            updateBookDto,
          )}. Error ${error.message}`,
        );
        throw new InternalServerErrorException(
          `Failed to update book. Error ${error.message}`,
        );
      });
  }
}
