import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    ConfigModule.forRoot(),
    LoggerModule.forRoot({
      pinoHttp: [
        {
          name: 'LibraryAPI',
          level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
          transport:
            process.env.NODE_ENV !== 'production'
              ? { target: 'pino-pretty' }
              : undefined,
          autoLogging: false,
        },
        process.stdout,
      ],
    }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGODB_ATLAS_URL,
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
