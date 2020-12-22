import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ALL_YEARS, COLORS, YEARS } from '../../../constants';
import BuiltBy from './BuiltBy';
import BaseChart from '../SidebarDetailed/BaseChart';
import Legend from './Legend';
import CustomSelect from './CustomSelect';
import { descending, sum } from 'd3-array';
import { getValue } from '../../../utils';
import City from './City';
import CitySearch from './CitySearch';
import filterIcon from '../../../assets/images/filter.svg';
import { Button } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    position: 'relative',
  },
  text: {
    fontSize: '24px',
  },
  headerContainer: {
    backgroundColor: COLORS.darkRed,
    padding: '0 25px 37px 23px',
  },
  legendContainer: {
    backgroundColor: COLORS.mediumRed,
    flex: '0 0 125px',
    height: '183px',
    padding: '30px',
  },
  topCitiesContainer: {
    padding: '0 25px 25px',
    flex: '1 1 100%',
    overflowY: 'auto',
  },
  legend: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignSelf: 'center',
  },
  subTitle: {
    fontSize: '16px',
    color: COLORS.black,
    fontWeight: 'bold',
  },
  legendInnerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    height: '125px',
  },
  innerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '25px 0 10px',
    position: 'sticky',
    backgroundColor: '#fff',
    top: '0',
  },
  columnContainer: {
    width: '55%',
    display: 'flex',
    flexDirection: 'column',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
  cities: {
    overflowY: 'auto',
    paddingBottom: '15px',
  },
  title: {
    fontSize: '16px',
    fontWeight: 'bold',
    lineHeight: '1.19',
  },
  button: {
    backgroundColor: COLORS.lightRed,
    color: COLORS.white,
    fontWeight: 'bold',
    textTransform: 'none',
    width: '243px',
    justifyContent: 'left',
    marginTop: '10px',
    borderRadius: '5px',
    fontSize: '16px',
  },
}));

const Sidebar = ({ cities, filteredFeatures, state, setState }) => {
  const classes = useStyles();
  const [searchText, setSearchText] = useState('');

  let years = YEARS.map((d) => d.toString()).concat([ALL_YEARS]);
  const onSelectChange = (value) => {
    setState((prevState) => ({
      ...prevState,
      selectedCalendarYear: value,
    }));
  };

  // Calculate the top cities, using search text to filter them
  const topCitiesByYear = cities
    .filter((city) => !searchText || city[0].toLowerCase().includes(searchText.toLowerCase()))
    .map((city) => {
      return [city[0], sum(city[1], (d) => getValue(d, state.selectedCalendarYear))];
    })
    .sort((a, b) => descending(a[1], b[1]));

  return (
    <div className={classes.container}>
      <div className={classes.headerContainer}>
        <h2>Resettled Refugee Services and Data Explorer</h2>
        <div className={classes.text}>
          <p>
            Explore data on refugee community locations and resources in the United States. Click on a circle to see a list of resources
            available in that city.
          </p>
        </div>
        <BuiltBy />
      </div>
      <div className={classes.legendContainer}>
        <div className={classes.legendInnerContainer}>
          <div className={classes.column}>
            <div className={classes.title}>Number of Arrivals</div>
            <BaseChart
              className={classes.legend}
              margin={{
                left: 75,
                right: 75,
                top: 0,
                bottom: 0,
              }}
            >
              <Legend filteredFeatures={filteredFeatures} selectedCalendarYear={state.selectedCalendarYear} />
            </BaseChart>
          </div>
          <div className={classes.columnContainer}>
            <CustomSelect
              onChange={onSelectChange}
              items={years}
              selectedItem={years.find((year) => year === state.selectedCalendarYear)}
              label="Select a year"
            />
            <Button
              variant="contained"
              className={classes.button}
              onClick={() =>
                setState((prevState) => ({
                  ...prevState,
                  isFilterOpen: true,
                }))
              }
              startIcon={<img alt="An icon representing how to filter results by nationalities." src={filterIcon} />}
            >
              Filter results
            </Button>
          </div>
        </div>
      </div>
      <div className={classes.topCitiesContainer}>
        <div className={classes.innerContainer}>
          <div className={classes.subTitle}>Top Cities by Arrival</div>
          <CitySearch searchText={searchText} setSearchText={setSearchText} />
        </div>
        <div className={classes.cities}>
          {topCitiesByYear.slice(0, 25).map((topCity) => (
            <City key={`row-for-${topCity[0]}`} city={topCity} selectedCalendarYear={state.selectedCalendarYear} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
