import { IsInt, IsNumber, IsOptional, IsString, Length, Max, Min } from "class-validator";
import { Type } from "class-transformer";

const dt = new Date()
export class GetStoreQuery {
  @IsNumber()
  @IsOptional()
  offset: number = 0;

  @IsNumber()
  @IsOptional()
  limit: number = 15;

  @IsString()
  @IsOptional()
  searchQuery: string;

  @IsNumber()
  @IsOptional()
  lat:number;

  @IsNumber()
  @IsOptional()
  lng:number;

  @IsNumber()
  @Min(1)
  @Max(7)
  @IsOptional()
  weekday:number // = dt.getDay()+1;

  @IsString()
  @IsOptional()
  startHour:string;

  @IsString()
  @IsOptional()
  endHour:string;
}