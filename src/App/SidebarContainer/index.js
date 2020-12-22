import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Sidebar from './Sidebar';
import SidebarDetailed from './SidebarDetailed';
import { COLORS, SIDEBAR_WIDTH } from '../../constants';
import DataSources from './DataSources';
import SidebarFilter from './SidebarFilter';

const useStyles = makeStyles((theme) => ({
  container: {
    width: SIDEBAR_WIDTH,
    height: '100%',
    position: 'fixed',
    zIndex: '2',
    top: 0,
    right: 0,
    borderRadius: '4px',
    boxShadow: '0 8px 16px 0 rgba(61, 65, 72, 0.15)',
    color: COLORS.white,
    backgroundColor: COLORS.white,
  },
}));

const SidebarContainer = ({ selectedCity, cities, state, setState, filteredFeatures, nationalities }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      {state.isFilterOpen ? (
        <SidebarFilter state={state} setState={setState} filteredFeatures={filteredFeatures} nationalities={nationalities} />
      ) : (
        <>
          {selectedCity ? (
            <SidebarDetailed selectedCity={selectedCity} />
          ) : (
            <Sidebar cities={cities} state={state} setState={setState} filteredFeatures={filteredFeatures} />
          )}
          <DataSources />
        </>
      )}
    </div>
  );
};

export default SidebarContainer;
