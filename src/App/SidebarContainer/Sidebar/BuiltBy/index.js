import React from 'react';
import { makeStyles } from '@material-ui/core';
import { COLORS } from '../../../../constants';

const useStyles = makeStyles(() => ({
  builtBy: {
    fontSize: '14px',
    color: COLORS.white,
    '& a': {
      color: COLORS.white,
      fontWeight: 'bold',
    },
  },
}));

const BuiltBy = () => {
  const classes = useStyles();

  return (
    <div className={classes.builtBy}>
      <div>
        Built by{` `}
        <a href="https://www.graphicacy.com" target="_blank" rel="noopener noreferrer">
          Graphicacy
        </a>
        {` `}with{` `}
        <a href="https://www.unhcr.org/en-us" target="_blank" rel="noopener noreferrer">
          UNHCR
        </a>
        {` `}for{` `}
        <a href="https://opportunity.census.gov" target="_blank" rel="noopener noreferrer">
          The Opportunity Project 2020
        </a>
      </div>
    </div>
  );
};

export default BuiltBy;
