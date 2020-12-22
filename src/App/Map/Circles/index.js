import React from 'react';
import { Source, Layer } from 'react-map-gl';
import { LAYER_ID } from '../../../constants';

const Circles = ({ data, paint, data_id }) => {
  return (
    <Source id={data_id} type="geojson" data={data}>
      <Layer id={LAYER_ID} type="circle" paint={paint} />
    </Source>
  );
};

export default Circles;
