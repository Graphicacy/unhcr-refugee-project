import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { COLORS } from '../../../constants';
import { Button } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { ascending } from 'd3-array';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    height: '61px',
    position: 'absolute',
    zIndex: '4',
    top: 0,
    left: 0,
    backgroundColor: COLORS.headerColor,
    boxShadow: `0 3px 6px 0 rgba(0, 0, 0, 0.16)`,
  },
  innerContainer: {
    padding: '14px 23px 13px 23px',
    color: COLORS.darkRed,
    fontSize: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: '1 1 100%',
  },
  description: {
    '& span': {
      fontWeight: 'bold',
    },
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  button: {
    fontWeight: 'bold',
    textTransform: 'none',
    backgroundColor: COLORS.headerColor,
    flex: '0 0 142px',
    whiteSpace: 'nowrap',
  },
}));

const ArrivalsFilterBar = ({ nationalities, setState }) => {
  const classes = useStyles();

  const clearFilters = () =>
    setState((prevState) => ({
      ...prevState,
      selectedNationalities: [],
    }));

  const sortedNationalities = nationalities.sort(ascending).join(', ');

  return (
    <div className={classes.container}>
      <div className={classes.innerContainer}>
        <div className={classes.description} title={sortedNationalities}>
          Showing Arrivals from:{` `}
          <span>{sortedNationalities}</span>
        </div>
        <Button onClick={clearFilters} variant="contained" endIcon={<Close />} className={classes.button}>
          Clear Filters
        </Button>
      </div>
    </div>
  );
};

export default ArrivalsFilterBar;
