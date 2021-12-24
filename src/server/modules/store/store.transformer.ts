import { Exclude, Expose, plainToInstance, Transform, Type } from "class-transformer";
import * as R from 'ramda';

import { Store, StoreHours } from "server/data/models";
import { StoreHourTransformer } from './storeHour.transformer';

@Exclude()
export class StoreTransformer {
  @Expose()
  uuid: string;

  @Expose()
  name: string;

  @Expose()
  address: string;

  @Expose()
  email: string;

  @Expose()
  lat: number;

  @Expose()
  long: number;

  @Expose()
  sortOrder: number;

  @Expose()
  hours: StoreHours[];

  // TODO: fix later
  // @Expose()
  // @Transform(R.ifElse(R.isEmpty, R.always(null), R.head))
  // @Type(() => StoreHourTransformer)
  // storeHours: StoreHourTransformer;

  @Expose()
  get storeHours() {
    return this?.hours?.length > 0 ? plainToInstance(StoreHourTransformer, this.hours[0]): this.hours;
  }

  @Expose()
  distance: number;


  constructor(partial: Partial<Store>) {
    Object.assign(this, partial);
  }
}
