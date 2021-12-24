import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  Response,
  StreamableFile,
  UseInterceptors, UsePipes, ValidationPipe
} from "@nestjs/common";
import { plainToInstance } from 'class-transformer';
import { StoreService } from './store.service';
import { StoreTransformer } from './store.transformer';
import { Transform } from 'stream';
import { Store } from "../../data/models";
import { createReadStream } from "fs";
import { GetStoreQuery } from "../../data/models/storeQuery";
@Controller('api/stores')
@UseInterceptors(ClassSerializerInterceptor)
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  //todo make a class for query params : done
  //todo add validations : done
  @Get()
  @UsePipes(new ValidationPipe( { transform: true, transformOptions: {enableImplicitConversion: true} }))
  async getSelected(
    // @Query('offset') offset = 0,
    // @Query('limit') limit = 15,
    // @Query('searchQuery') searchQuery?: string,
    // @Query('lat') lat?: number,
    // @Query('lng') lng?: number,
    // @Query('weekday') weekday?:number,
    // @Query('startHour') startHour?: string,
    // @Query('endHour') endHour?: string,
    @Query() queryParams: GetStoreQuery
  ): Promise<StoreTransformer[]> {
    console.log(queryParams)
    queryParams.limit = queryParams.limit > 50 ? 50 : queryParams.limit;
    const stores = await this.storeService.getSelected(queryParams);
    stores.map(store=> {
      // @ts-ignore
      const [a, b] = [queryParams.lat-store.lat, queryParams.lng-store.long]
      const dist = (a*a) + (b*b)
      store['distance']= dist
    })
    return plainToInstance(StoreTransformer, stores); // or plainToClass (Store, stores)
  }

  // this endpoint should export all stores from database as a csv file
  @Get('export')
  async export(@Response({ passthrough: true }) res):Promise<StreamableFile> {
    const stores = await this.storeService.getStream();
    const transform = new Transform({
      objectMode: true,
      //instead of transforming chunk to json, we can put it to csv stream
      transform(chunk, encoding, callback) {
        this.push(JSON.stringify(Object.assign({}, chunk), null, 2));
        callback();
      },
    });
    res.set({
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="stores.json"',
    });
    // stores.pipe(transform).pipe(res);
    return new StreamableFile(stores.pipe(transform));
  }
}
