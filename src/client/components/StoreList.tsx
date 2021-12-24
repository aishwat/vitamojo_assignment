import React, { useEffect, useState } from "react";
import { Space } from "antd";

import { getStores, getStoresByParams, storeParams } from "../app/api";
import StoreCard from "./StoreCard";
import styled from "styled-components";
import InfiniteScroll from "react-infinite-scroll-component";

const StyledSpace = styled(Space)`
  width: 100%;
`;

export default function(props) {
  const pageSize = 10;
  const [stores, setStores] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  //todo : create interface for getStoresByParams
  // useEffect(() => {
  //   (async () => {
  //     setStores((await getStoresByParams(params)).data);
  //   })();
  // }, []);

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      let params: storeParams = {
        offset: 0,
        limit: pageSize,
        searchQuery: props?.name,
        lat: props?.location?.lat,
        lng: props?.location?.long,
        weekday: props?.weekday,
        startHour: props?.time?.startHour,
        endHour: props?.time?.endHour
      };
      setStores((await getStoresByParams(params)).data);
      setIsLoading(false);
    })();
  }, [props]); //todo check hook

  const fetchData = async () => {
    let params: storeParams = {
      offset: stores?.length,
      limit: pageSize,
      searchQuery: props.name,
      lat: props.location?.lat ?? null,
      lng: props.location?.long ?? null,
      weekday: props.weekday,
      startHour: props.time.startHour,
      endHour: props.time.endHour
    };
    const _stores = (await getStoresByParams(params)).data;
    if (_stores && _stores.length < pageSize) {
      setHasMore(false);
    }
    setStores([...stores, ..._stores]);
  };

  return (
    <div
      id="scrollableDiv"
      style={{
        height: 700,
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      {isLoading && <p>Loading... </p>}
      <InfiniteScroll
        dataLength={stores && stores.length} //This is important field to render the next data
        next={fetchData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>End of list</b>
          </p>
        }
        scrollableTarget="scrollableDiv"
      >
        {stores && stores.map((store) => (
          <StoreCard key={store.uuid} {...store} />
        ))}
      </InfiniteScroll>
    </div>
  );
}
