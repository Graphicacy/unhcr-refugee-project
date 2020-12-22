import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { scaleLinear, scaleTime } from 'd3-scale';
import { line as d3_line } from 'd3-shape';
import { descending, extent, max, merge } from 'd3-array';
import { nest } from 'd3-collection';
import Axes from '../Axes';
import { format } from 'd3-format';
import Voronoi from '../Voronoi';
import { COLORS } from '../../../../constants';

const useStyles = makeStyles((theme) => ({
  line: {
    stroke: '#DDD0D0',
    fill: 'none',
    strokeWidth: '1px',
    shapeRendering: 'geometricPrecision',
    '&.active': {
      stroke: COLORS.darkRed,
      strokeWidth: '2px',
    },
    pointerEvents: 'none',
  },
  circle: {
    fill: COLORS.darkRed,
    stroke: 'none',
    pointerEvents: 'none',
  },
  activeText: {
    fontSize: '18px',
    fill: COLORS.darkRed,
    stroke: 'none',
    textAnchor: 'middle',
    fontWeight: 'bold',
    pointerEvents: 'none',
  },
  text: {
    fontSize: '16px',
    fill: COLORS.darkRed,
    stroke: 'none',
    cursor: 'pointer',
    textTransform: 'none',
    '&.active': {
      fontWeight: 'bold',
    },
  },
}));

const LineChart = ({ innerHeight, innerWidth, values }) => {
  const classes = useStyles();
  const [activePoint, setActivePoint] = useState(null);

  const xAccessor = (d) => d.year;
  const xScale = scaleTime().range([0, innerWidth]).domain(extent(values, xAccessor));

  const yAccessor = (d) => d?.value;
  const yScale = scaleLinear()
    .range([innerHeight, 0])
    .domain([0, max(values, yAccessor)]);

  const line = d3_line()
    .x((d) => xScale(xAccessor(d)))
    .y((d) => yScale(yAccessor(d)));

  const nestedData = nest()
    .key((d) => d.country)
    .entries(values);

  const onMouseOver = (point) => () => setActivePoint(point);

  const onMouseOut = () => setActivePoint(null);

  const formatPoint = (key, f) => ({
    x: xScale(xAccessor(f)),
    y: yScale(yAccessor(f)),
    item: {
      id: key,
      value: yAccessor(f),
    },
  });

  // Calculate points for the Voronoi diagram
  const points = merge(
    nestedData.map((d) => {
      return d.values.map((f) => formatPoint(d.key, f));
    }),
  );

  return (
    <g className="countries-over-time" onMouseOut={onMouseOut}>
      {nestedData
        .sort((a, b) => descending(yAccessor(a.values[a.values.length - 1]), yAccessor(b.values[b.values.length - 1])))
        .map((d, i) => {
          return (
            <g key={`group-for-${d.key}`}>
              <path className={`${classes.line} ${activePoint && activePoint.item.id === d.key ? 'active' : ''}`} d={line(d.values)} />
              <text
                className={`${classes.text} ${activePoint && activePoint.item.id === d.key ? 'active' : ''}`}
                x={innerWidth}
                dx={'.5em'}
                y={i * 20}
                onMouseOver={() => {
                  const lastPoint = d.values[d.values.length - 1];
                  return setActivePoint(formatPoint(d.key, lastPoint));
                }}
                key={`label-for-${d.key}`}
              >
                {d.key}
              </text>
            </g>
          );
        })}
      <Voronoi height={innerHeight} width={innerWidth} points={points} onMouseOver={onMouseOver} />
      {activePoint && (
        <g transform={`translate(${activePoint.x},${activePoint.y})`}>
          <circle r={5} className={classes.point} />
          <text dy="-1em" className={classes.activeText}>
            {format(',.0f')(activePoint.item.value)}
          </text>
        </g>
      )}
      <Axes xScale={xScale} yScale={yScale} yScaleTickFormat={format(',.0f')} height={innerHeight} />
    </g>
  );
};

export default LineChart;
