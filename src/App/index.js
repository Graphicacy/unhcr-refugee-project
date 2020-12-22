import React, { useEffect, useMemo, useState } from 'react';
import Map from './Map';
import { DEFAULT_VIEWPORT, REGION_LOOKUP, SPEED } from '../constants';
import Spinner from './Spinner';
import { csv } from 'd3-fetch';
import { useParams } from 'react-router-dom';
import { cityToId, getValue } from '../utils';
import { groups } from 'd3-array';
import SidebarContainer from './SidebarContainer';
import { FlyToInterpolator } from 'react-map-gl';

const App = () => {
  const [state, setState] = useState({
    viewport: DEFAULT_VIEWPORT,
    selectedFeature: null,
    selectedCalendarYear: '2020',
    data: [],
    selectedNationalities: [],
    isFilterOpen: false,
    nationalities: [],
  });
  const { city = '' } = useParams();

  useEffect(() => {
    csv(require('./../assets/data/refugees.csv'), (d) => {
      return {
        ...d,
        location: `${d['Placement City']}, ${d['Placement State']}`,
        nationality: d['Nationality'],
        geometry: { type: 'Point', coordinates: JSON.parse(d.center) },
      };
    }).then((results) =>
      setState((prevState) => ({
        ...prevState,
        data: results,
      })),
    );
  }, []);

  // Filter the data for the selected year - and selected nationalities
  const filteredFeatures = state.data
    .filter((d) => getValue(d, state.selectedCalendarYear))
    .filter((d) => !state.selectedNationalities.length || state.selectedNationalities.includes(d.nationality));

  // Get nationalities based on selected year
  const nationalities = useMemo(
    () =>
      Array.from(new Set(state.data.filter((d) => getValue(d, state.selectedCalendarYear)).map((d) => d.Nationality))).map((d) => [
        d,
        REGION_LOOKUP.has(d) ? REGION_LOOKUP.get(d) : 'World',
      ]),
    [state.data, state.selectedCalendarYear],
  );

  // Group the data by city and create a feature collection
  const cities = groups(filteredFeatures, (d) => d.location);

  // If a route is specified then find it's feature
  const selectedCity = cities.find((d) => cityToId(d[0]) === city);
  const center = selectedCity && selectedCity[1][0].geometry.coordinates;

  useEffect(() => {
    if (center) {
      const [longitude, latitude] = center;
      setState((prevState) => {
        return {
          ...prevState,
          viewport: {
            longitude,
            latitude,
            zoom: 8,
            transitionInterpolator: new FlyToInterpolator({ speed: SPEED }),
            transitionDuration: 'auto',
          },
        };
      });
    } else {
      setState((prevState) => {
        return {
          ...prevState,
          viewport: DEFAULT_VIEWPORT,
        };
      });
    }
  }, [center]);

  return (
    <div className="App">
      {!state.data.length ? (
        <Spinner />
      ) : (
        <>
          <Map state={state} setState={setState} cities={cities} />
          <SidebarContainer
            state={state}
            cities={cities}
            selectedCity={selectedCity}
            setState={setState}
            filteredFeatures={filteredFeatures}
            nationalities={nationalities}
          />
        </>
      )}
    </div>
  );
};

export default App;
