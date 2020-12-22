import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { COLORS, COMMA_FORMATTER, MAX_RADIUS, MIN_RADIUS } from '../../../../constants';
import { scaleLinear } from 'd3-scale';
import { descending, rollups, sum } from 'd3-array';
import { getValue } from '../../../../utils';

const useStyles = makeStyles(() => ({
  legend: {
    '& circle': {
      stroke: COLORS.lightRed,
      strokeWidth: '2px',
      fill: COLORS.darkRed,
    },
    '& text': {
      fill: COLORS.white,
      stroke: 'none',
      fontSize: '14px',
    },
  },
  line: {
    strokeWidth: '1px',
    stroke: COLORS.white,
    fill: 'none',
  },
}));

const Legend = ({ innerHeight, innerWidth, filteredFeatures, selectedCalendarYear }) => {
  const classes = useStyles();

  // Group the data by city and create a feature collection
  const cities = rollups(
    filteredFeatures,
    (v) => sum(v, (d) => getValue(d, selectedCalendarYear)),
    (d) => d.location,
  ).sort((a, b) => descending(a[1], b[1]));
  const maxCity = cities.shift();
  const minCity = cities.pop();

  const bubbleScale = scaleLinear().range([MIN_RADIUS, MAX_RADIUS]).domain([minCity[1], maxCity[1]]);

  const [minValue, maxValue] = bubbleScale.domain();
  const values = [maxValue, (maxValue - minValue) / 2, minValue];

  return (
    <g className={classes.legend} transform={`translate(${innerWidth / 5},0)`}>
      {values.map((d, i) => {
        const r = bubbleScale(d);
        return <circle key={`bubble-for-${i}-value`} cy={innerHeight - r} r={r} />;
      })}
      {values.map((d, i) => {
        const r = bubbleScale(d);
        const x1 = i % 2 ? -30 : 0;
        const dx = i % 2 ? -5 : 35;
        const textAnchor = i % 2 ? 'end' : 'start';
        const y = innerHeight - r * 2;
        return (
          <g key={`line-for-${i}-value`} transform={`translate(${x1},0)`}>
            <line className={classes.line} x1={0} x2={30} y1={y} y2={y} />
            <text dx={dx} y={y + 5} style={{ textAnchor }}>
              {COMMA_FORMATTER(d)}
            </text>
          </g>
        );
      })}
    </g>
  );
};
export default Legend;
