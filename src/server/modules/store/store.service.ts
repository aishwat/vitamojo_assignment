import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Store } from 'server/data/models';
import { StoreRepository } from 'server/data/repositories';
import { getRepository } from 'typeorm';
import { GetStoreQuery } from "../../data/models/storeQuery";

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(StoreRepository)
    private readonly storeRepository: StoreRepository,
  ) {}

  getOne(storeUUID: string, relations = []) {
    return this.storeRepository.findOne({
      where: { uuid: storeUUID },
      relations,
    });
  }

  getStream(): any {
    return this.storeRepository
      .createQueryBuilder('store')
      // .limit(100) //remove later
      // .offset(0)
      .stream();
  }

  getSelected(
    // offset?: number,
    // limit?: number,
    // searchQuery?: string,
    // lat?: number,
    // long?: number,
    // weekday?: number,
    // startHour?: string,
    // endHour?: string,
    queryParams: GetStoreQuery
  ): Promise<Store[]> {
    const {offset, limit, searchQuery, lat, lng, weekday, startHour, endHour} = queryParams;
    const query = this.storeRepository
      .createQueryBuilder('store')
      .orderBy('store.sortOrder')
      .limit(limit)
      .offset(offset);
    console.log('searchQuery', searchQuery)
    // if (searchQuery) {
    //   query.where('store.name like :name', { name: `%${searchQuery}%` });
    // }
    searchQuery ? query.where('store.name like :name', { name: `%${searchQuery}%` }) : null;
    // .where('store.name = :name', { name: searchQuery }) // strict type // todo: check if strict needed
    (weekday || startHour || endHour) ? query.leftJoinAndSelect('store.hours', 'hour', 'hour.store_id=store.id') : null;
    (weekday)?query.andWhere('hour.weekday = :weekday ', { weekday }):null;
    (startHour)?query.andWhere('hour.from >= :startHour ', { startHour }):null;
    (endHour)?query.andWhere('hour.from <= :endHour ', { endHour }):null;
      // https://gist.github.com/statickidz/8a2f0ce3bca9badbf34970b958ef8479
      // better approach would be google s2 or h3
    (lat && lng)? query.orderBy(`(  (store.lat-${lat})* (store.lat-${lat})  + (store.long-${lng})* (store.long-${lng})  )`,):null;
    (lat && lng)? console.log('order by lat lng'):null;
    return query.getMany();
  }
}
