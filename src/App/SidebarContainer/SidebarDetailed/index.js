import React from 'react';
import { makeStyles } from '@material-ui/core';
import BaseChart from './BaseChart';
import LineChart from './LineChart';
import moment from 'moment';
import CloseIcon from '@material-ui/icons/Close';
import { merge, sum } from 'd3-array';
import { COLORS, COMMA_FORMATTER, YEARS } from '../../../constants';
import Resources from './Resources';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: `${COLORS.white} !important`,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  close: {
    position: 'absolute',
    top: 0,
    zIndex: '3',
    right: 0,
    width: '37px',
    height: '37px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    '&:hover': {
      background: COLORS.darkGray,
    },
  },
  closeIcon: {
    color: COLORS.white,
    fontSize: '32px',
  },
  header: {
    background: '#8F0A09 0 0 no-repeat padding-box',
    opacity: 0.95,
    height: '119px',
    color: '#FFFFFF',
  },
  innerHeader: {
    padding: (props) => `${props.left} 0 0 30px`,
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: '18px',
    '& span': {
      fontWeight: 'bold',
    },
  },
  innerContainer: {
    paddingLeft: (props) => props.left,
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 100%',
    overflowY: 'auto',
    '& .resource': {
      padding: '5px 0',
    },
    '& a': {
      color: '#2588AC',
    },
  },
  subHeader: {
    textTransform: 'uppercase',
    color: COLORS.darkGray,
    fontSize: '14px',
    paddingTop: '20px',
  },
  visualization: {
    width: '100%',
    height: '500px',
  },
}));

const SidebarDetailed = ({ selectedCity }) => {
  const classes = useStyles({ left: '25px' });
  const history = useHistory();

  // Get all refugee values for plotting
  const values = merge(
    (selectedCity ? selectedCity[1] : []).map((d) => {
      return YEARS.map((i) => {
        return {
          year: moment(i, 'YYYY'),
          country: d?.Nationality,
          value: +d[`CY ${i}`],
        };
      });
    }),
  );
  const city = selectedCity && selectedCity[0];

  // Get total refugees for sub-header
  const totalRefugees = sum(values, (d) => d.value);

  return (
    <div className={`${classes.container} ${selectedCity ? 'open' : ''}`}>
      <div className={classes.close}>
        <CloseIcon className={classes.closeIcon} onClick={() => history.push({ pathname: `/` })} />
      </div>
      <div className={classes.header}>
        <div className={classes.innerHeader}>
          <div className={classes.title}>{city}</div>
          <div className={classes.subTitle}>
            <span>{`${COMMA_FORMATTER(totalRefugees)} `}</span>refugees arrived over the last decade
          </div>
        </div>
      </div>
      {selectedCity && (
        <>
          <div className={classes.innerContainer}>
            <div className={classes.subHeader}>
              Country of origin change over time
              <BaseChart className={classes.visualization}>
                <LineChart values={values} />
              </BaseChart>
            </div>
            <Resources selectedCity={selectedCity} />
          </div>
        </>
      )}
    </div>
  );
};

export default SidebarDetailed;
