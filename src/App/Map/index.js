import React, { useState, useRef, useEffect } from 'react';
import ReactMapGL from 'react-map-gl';
import { CIRCLE_OPACITY, COLORS, LAYER_ID, MAX_RADIUS, MIN_RADIUS, SIDEBAR_WIDTH } from '../../constants';
import Circles from './Circles';
import Tooltip from './Tooltip';
import { max, sum } from 'd3-array';
import { useHistory } from 'react-router-dom';
import { cityToId, getValue } from '../../utils';
import ArrivalsFilterBar from './ArrivalsFilterBar';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  map: {
    position: 'absolute',
    width: `calc(100vw - ${SIDEBAR_WIDTH}px)`,
    height: '100%',
  },
}));

const Map = (props) => {
  const classes = useStyles();
  const [state, setState] = useState({
    messageClass: 'visible',
    mapStyle: 'mapbox://styles/mapbox/light-v9',
    popupInfo: null,
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  });
  const history = useHistory();
  const mapRef = useRef(null);

  useEffect(() => {
    const { offsetWidth, offsetHeight } = mapRef.current;
    setState((prevState) => {
      return {
        ...prevState,
        width: offsetWidth,
        height: offsetHeight,
      };
    });
  }, []);

  const _onViewportChange = (viewport) =>
    props.setState((prevState) => {
      return {
        ...prevState,
        viewport,
      };
    });

  const _onHover = (event) => {
    const {
      features,
      srcEvent: { offsetX, offsetY },
    } = event;
    const hoveredFeature = features && features.find((f) => f.layer.id === LAYER_ID);
    setState((prevState) => ({ ...prevState, popupInfo: hoveredFeature, x: offsetX, y: offsetY }));
  };

  const _onMouseClick = (event) => {
    const { features } = event;
    const selectedFeature = features && features.find((f) => f.layer.id === LAYER_ID);
    return history.push({ pathname: `/${cityToId(selectedFeature?.properties?.location)}` });
  };

  const features = props.cities.map(([city, rows]) => {
    const firstRow = rows[0];
    return {
      type: 'Feature',
      properties: {
        location: city,
        total_per_city: sum(rows, (d) => getValue(d, props.state.selectedCalendarYear)),
        rows,
      },
      geometry: firstRow.geometry,
    };
  });

  // Get a scale for the different circle sizes
  const maxTotalPerCity = max(features, (d) => +d.properties.total_per_city);

  return (
    <>
      <div className={classes.map} ref={mapRef}>
        {!!props.state.selectedNationalities.length && (
          <ArrivalsFilterBar setState={props.setState} nationalities={props.state.selectedNationalities} />
        )}
        <ReactMapGL
          {...props.state.viewport}
          width="100%"
          height="100%"
          mapStyle={state.mapStyle}
          onViewportChange={_onViewportChange}
          dragRotate={false}
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          onHover={_onHover}
          onClick={_onMouseClick}
        >
          <Circles
            data={{
              type: 'FeatureCollection',
              features,
            }}
            paint={{
              'circle-radius': {
                property: 'total_per_city',
                stops: [
                  [0, MIN_RADIUS],
                  [maxTotalPerCity, MAX_RADIUS],
                ],
              },
              'circle-opacity': CIRCLE_OPACITY,
              'circle-color': COLORS.darkRed,
            }}
            data_id="refugee_circles"
          />
        </ReactMapGL>
      </div>
      {state.popupInfo && <Tooltip {...state} selectedCalendarYear={props.state.selectedCalendarYear} />}
    </>
  );
};

export default Map;
