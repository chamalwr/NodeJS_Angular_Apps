import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Query,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Controller()
export class AuthorsController {
  constructor(
    private readonly authorsService: AuthorsService,
    @InjectPinoLogger(AuthorsController.name)
    private readonly logger: PinoLogger,
  ) {}

  @Post('author')
  async create(@Body() createAuthorDto: CreateAuthorDto) {
    return await this.authorsService
      .create(createAuthorDto)
      .then((result) => {
        if (result) {
          this.logger.debug(`Created new author as ${JSON.stringify(result)}`);
          return result;
        }
        this.logger.warn(`Failed to create new author`);
        throw new InternalServerErrorException(
          'Failed to create new author due to server error',
        );
      })
      .catch((error) => {
        this.logger.error(
          `Error occured while creating a new author. Error ${error.message}`,
        );
        throw new InternalServerErrorException(error.message);
      });
  }

  @Get('authors')
  async findAll(@Query('page') page: number, @Query('take') take: number) {
    return await this.authorsService
      .findAll(page, take)
      .then((result) => {
        if (result) {
          this.logger.debug(`Fetched authors ${JSON.stringify(result)}`);
          return result;
        }
        this.logger.warn(
          `No authors found. returned result as ${JSON.stringify(result)}`,
        );
        throw new NotFoundException(
          `No authors found. returned result as ${JSON.stringify(result)}`,
        );
      })
      .catch((error) => {
        this.logger.error(
          `Error occured while getting all authors Error ${error.message}`,
        );
        throw new InternalServerErrorException(error.message);
      });
  }

  @Get('author/:id')
  async findOne(@Param('id') id: string) {
    return await this.authorsService
      .findOne(id)
      .then((result) => {
        if (result) {
          this.logger.debug(
            `Found author on ID ${id} as ${JSON.stringify(result)}`,
          );
          return result;
        }
        this.logger.warn(`No author found on id:  ${id}`);
        throw new NotFoundException(`No author found on id : ${id}`);
      })
      .catch((error) => {
        this.logger.error(
          `Failed to get author on id ${id} returned Error: ${error.message}`,
        );
        throw new InternalServerErrorException(error.message);
      });
  }

  @Put('author/:id')
  async update(
    @Param('id') id: string,
    @Body() updateAuthorDto: UpdateAuthorDto,
  ) {
    return await this.authorsService
      .update(id, updateAuthorDto)
      .then((result) => {
        if (result) {
          this.logger.debug(
            `Updating complete for author ${id} returned result ${JSON.stringify(
              result,
            )}`,
          );
          return result;
        }
        this.logger.warn(
          `Failed to update author. author not found on ID ${id}`,
        );
        throw new NotFoundException(
          `Failed to update author. author not found on ID ${id}`,
        );
      })
      .catch((error) => {
        this.logger.error(
          `Failed to update author on id ${id} returned Error: ${error.message}`,
        );
        throw new InternalServerErrorException(error.message);
      });
  }
}
