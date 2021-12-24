import React from 'react';
import { Card } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Meta } = Card;

interface StoreCardProps {
  address: string;
  email: string;
  lat: number;
  long: number;
  name: string;
  sortOrder: number;
  status: boolean;
  uuid: string;

  // T̶O̶D̶O̶ ̶i̶m̶p̶l̶e̶m̶e̶n̶t̶ ̶t̶h̶i̶s̶ ̶o̶n̶ ̶b̶a̶c̶k̶e̶n̶d̶
  distance?: number;

  // T̶O̶D̶O̶ ̶r̶e̶t̶u̶r̶n̶ ̶t̶h̶e̶s̶e̶ ̶f̶i̶e̶l̶d̶s̶ ̶f̶r̶o̶m̶ ̶b̶a̶c̶k̶e̶n̶d̶
  storeHours?: {
    weekday: number;
    from: string;
    to: string;
  };
}

const StyledEnvironmentOutlined = styled(EnvironmentOutlined)`
  margin-right: 8px;
`;

export default function (props: StoreCardProps) {
  return (
    <Card
      title={
        <Meta
          description={
            <div>
              <StyledEnvironmentOutlined />
              {props.address}
            </div>
          }
          title={props.name}
        />
      }
      style={{ width: 300 }}
    >
      {props.distance ? (
        <p>Distance: {props.distance.toPrecision(2)}km</p>
      ) : (
        <div>
          <p>Lat: {props.lat}</p>
          <p>Lon: {props.long}</p>

        </div>
      )}
      {props.storeHours && (
        <p>
          Opens at {props.storeHours.from}; Closes at {props.storeHours.to};
          || week {props.storeHours.weekday}
        </p>
      )}
    </Card>
  );
}
