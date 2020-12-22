import React from 'react';
import { makeStyles } from '@material-ui/core';
import { COLORS } from '../../../constants';

const useStyles = makeStyles(() => ({
  dataSources: {
    position: 'fixed',
    bottom: '0px',
    padding: '15px 0 16px 23px',
    width: '100%',
    backgroundColor: '#fff',
    boxShadow: '0 0 6px 0 rgba(0, 0, 0, 0.16)',
    color: COLORS.darkGray,
    '& a': {
      color: COLORS.blue,
    },
  },
}));

const DataSources = () => {
  const classes = useStyles();

  return (
    <div className={classes.dataSources}>
      Data Sources:{' '}
      <a href="https://www.wrapsnet.org/" target="_blank" rel="noopener noreferrer">
        Refugee Processing Center
      </a>{' '}
      and{' '}
      <a href="https://www.charitynavigator.org/" target="_blank" rel="noopener noreferrer">
        Charity Navigator
      </a>
    </div>
  );
};

export default DataSources;
