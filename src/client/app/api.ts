import axios from "axios";

export function getStores() {
  return axios.get("/api/stores");
}

export interface storeParams {
  offset?,
  limit?,
  lat?,
  lng?,
  weekday?,
  startHour?,
  endHour?,
  searchQuery?
}

export function getStoresByParams(storeParams) {
  // let query = `offset=${offset}&limit=${limit}`
  // if(lat && lng){
  //   query += `&lat=${lat}&lng=${lng}`
  // }
  // if(searchQuery){
  //   query += `&searchQuery=${searchQuery}`
  // }
  // if(weekday){
  //   query += `&weekday=${weekday}`
  // }
  // if(startHour && endHour ){
  //   query += `&startHour=${startHour}&endHour=${endHour}`
  // }
  // console.log(query)
  return axios.get(`/api/stores?`, { params: { ...storeParams } });
}
