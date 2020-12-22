import React from 'react';
import { makeStyles } from '@material-ui/core';
import { COLORS, COMMA_FORMATTER } from '../../../../constants';
import { cityToId } from '../../../../utils';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(() => ({
  row: {
    display: 'flex',
    flexDirection: 'column',
    color: COLORS.darkGray,
    fontSize: '24px',
    paddingBottom: '10px',
    cursor: 'pointer',
  },
  location: {
    fontWeight: 'bold',
    lineHeight: '1.33',
  },
  subLocation: {
    fontSize: '18px',
    lineHeight: '1.78',
    '& span': {
      fontWeight: 'bold',
    },
  },
}));

const City = ({ city, selectedCalendarYear }) => {
  const classes = useStyles();
  const history = useHistory();

  const onClick = () => history.push({ pathname: `/${cityToId(city[0])}` });

  return (
    <div className={classes.row} onClick={onClick}>
      <div className={classes.location}>{city[0]}</div>
      <div className={classes.subLocation}>
        <span>{COMMA_FORMATTER(city[1])}</span>
        {` refugees arrived in ${selectedCalendarYear}`}
      </div>
    </div>
  );
};

export default City;
