import React, { useEffect, useRef, useState } from 'react';
import { scaleLinear } from 'd3-scale';
import { descending, max } from 'd3-array';
import { makeStyles } from '@material-ui/core';
import { COLORS, COMMA_FORMATTER } from '../../../constants';
import { getValue } from '../../../utils';

const useStyles = makeStyles((theme) => ({
  headerContainer: {
    textAlign: 'left',
    width: (props) => props.tooltipWidth,
    minHeight: '85px',
    background: '#8f0a09 0 0 no-repeat padding-box',
    opacity: '0.95',
    color: '#ffffff',
    padding: '0 0 10px 0',
  },
  countryOfOriginContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItem: 'center',
  },
  lineContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '10px',
  },
  countryText: {
    fontSize: '16px',
    color: COLORS.darkGray,
    width: '50%',
  },
  line: {
    backgroundColor: COLORS.darkRed,
    height: '5px',
    borderRadius: '11px',
    marginRight: '5px',
  },
  lineText: {
    fontSize: '16px',
    color: COLORS.darkRed,
  },
  content: {
    textAlign: 'left',
    fontSize: '16px',
    color: COLORS.darkGray,
    paddingLeft: '19px',
    paddingTop: '12px',
  },
  infoText: {
    textAlign: 'right',
    fontSize: '14px',
    fontStyle: 'italic',
    color: COLORS.darkRed,
    padding: '10px',
  },
}));

const Tooltip = ({ popupInfo, selectedCalendarYear, x, y, width, height }) => {
  const tooltipWidth = 325;
  const [tooltipHeight, setTooltipHeight] = useState(300);
  const buffer = 10;
  const classes = useStyles({ tooltipWidth });
  const tooltipRef = useRef(null);

  useEffect(() => {
    const { offsetHeight } = tooltipRef.current;
    setTooltipHeight(offsetHeight);
  }, []);

  // Sort nationalities by number of refugees
  const location = popupInfo.properties.location;
  const numRefugees = popupInfo.properties.total_per_city;
  const valueAccessor = (d) => getValue(d, selectedCalendarYear);
  let nationalities = JSON.parse(popupInfo.properties.rows).sort((a, b) => descending(valueAccessor(a), valueAccessor(b)));

  // Get the top five to display
  const topFiveNationalities = nationalities.slice(0, 5);
  const xScale = scaleLinear()
    .range([0, 100])
    .domain([0, max(topFiveNationalities.map(valueAccessor))]);

  // If the tooltip is going over the edge of the right side of the screen
  if (tooltipWidth + x > width - buffer) {
    x -= tooltipWidth;
  }

  // If the tooltip is going over the edge of the bottom side of the screen
  if (tooltipHeight + y > height - buffer) {
    y -= tooltipHeight;
  }

  return (
    <div className="tooltip" style={{ left: x, top: y }} ref={tooltipRef}>
      <div className={classes.headerContainer}>
        <div className="tooltip_header_title">{location}</div>
        <div className="tooltip_header_subtitle">{`${COMMA_FORMATTER(numRefugees)} refugees arrived in ${selectedCalendarYear}`}</div>
      </div>
      <div className="tooltip_subheader">TOP 5 COUNTRIES OF ORIGIN</div>
      <div className={classes.content}>
        <div className={classes.countryOfOriginContainer}>
          {topFiveNationalities.map((d, i) => {
            return (
              <div key={`nationality-${i}`} className={classes.lineContainer}>
                <div className={classes.countryText}>{d['Nationality']}</div>
                <div className={classes.line} style={{ width: xScale(valueAccessor(d)) }} />
                <div className={classes.lineText}>{COMMA_FORMATTER(valueAccessor(d))}</div>
              </div>
            );
          })}
        </div>
        <div className={classes.infoText}>Click on city to see more info</div>
      </div>
    </div>
  );
};

export default Tooltip;
