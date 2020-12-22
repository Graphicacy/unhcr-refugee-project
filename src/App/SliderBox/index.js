import React from 'react';
import { makeStyles } from '@material-ui/core';
import { COLORS, MAX_YEAR, MIN_YEAR, SPEED, YEARS } from '../../constants';
import SearchBar from './SearchBar';
import { FlyToInterpolator } from 'react-map-gl';
import Legend from './Legend';
import BaseChart from '../SideBar/BaseChart';
import { range } from 'd3-array';
import CustomSelect from './CustomSelect';
import BuiltBy from './BuiltBy';
import DataSources from './DataSources';

const useStyles = makeStyles(() => ({
  mapOverlay: {
    fontSize: '12px',
    position: 'absolute',
    width: '100%',
    top: '0',
    left: '0',
    padding: '10px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mapOverlayInner: {
    backgroundColor: COLORS.white,
    width: '25%',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
    borderRadius: '3px',
    padding: '15px',
    marginBottom: '10px',
    opacity: '0.7',
    display: 'flex',
    flexDirection: 'column',
    '& h2': {
      color: COLORS.darkRed,
      lineHeight: '24px',
      fontSize: '16px',
      display: 'block',
      margin: '0 0 10px',
    },
    '& h3': {
      textTransform: 'uppercase',
      fontWeight: 'normal',
    },
  },
  legend: {
    width: '100%',
    height: 100,
    display: 'flex',
    alignSelf: 'center',
  },
}));

const SliderBox = ({ state, setState, filteredFeatures }) => {
  const classes = useStyles();

  let years = YEARS.map((d) => `CY ${d}`);
  const onSelectChange = (value) => {
    setState((prevState) => ({
      ...prevState,
      selectedCalendarYear: value,
    }));
  };

  return (
    <div className={classes.mapOverlay}>
      <div className={classes.mapOverlayInner}>
        <h2>{`Refugee Arrival Locations ${MIN_YEAR} - ${MAX_YEAR}`}</h2>
        <CustomSelect
          onChange={onSelectChange}
          items={years}
          selectedItem={years.find((year) => year === state.selectedCalendarYear)}
          label="Select a year"
        />
        <SearchBar
          onSubmit={(result) => {
            const [longitude, latitude] = result.center;
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
          }}
        />
        <BaseChart className={classes.legend}>
          <Legend filteredFeatures={filteredFeatures} selectedCalendarYear={state.selectedCalendarYear} />
        </BaseChart>
        <BuiltBy />
        <DataSources />
      </div>
    </div>
  );
};

export default SliderBox;
