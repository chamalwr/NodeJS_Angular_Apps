import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Author, AuthorDocument } from './entities/author.entity';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectModel(Author.name)
    private readonly authorModel: Model<AuthorDocument>,
    @InjectPinoLogger(AuthorsService.name) private readonly logger: PinoLogger,
  ) {}
  async create(createAuthorDto: CreateAuthorDto) {
    this.logger.debug(
      `Creating author with payload ${JSON.stringify(createAuthorDto)}`,
    );
    return await this.authorModel.create(createAuthorDto);
  }

  async findAll(page?: number, take?: number) {
    const totalAuthors = await this.authorModel.count();
    if (page && take) {
      this.logger.debug(
        `Getting authors paginated sliced into ${page} pages and, ${take} authors for each page`,
      );
      const authors = await this.authorModel
        .find()
        .limit(take * 1)
        .skip((page - 1) * take)
        .exec();

      if (authors) {
        return {
          authors,
          totalPages: Math.ceil(totalAuthors / take),
          currentPage: page,
        };
      }
      return undefined;
    }
    this.logger.debug(
      `Returning authors unpaginated total ${totalAuthors} records`,
    );
    const authors = await this.authorModel.find().exec();
    return { authors, totalAuthors: totalAuthors };
  }

  async findOne(id: string) {
    return await this.authorModel.findById(id);
  }

  async update(id: string, updateAuthorDto: UpdateAuthorDto) {
    this.logger.debug(
      `Updating author id ${id} with payload ${JSON.stringify(
        updateAuthorDto,
      )}`,
    );
    return await this.authorModel.findByIdAndUpdate(id, updateAuthorDto, {
      new: true,
    });
  }
}
