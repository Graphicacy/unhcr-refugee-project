import React, { useEffect, useRef } from 'react';
import { select } from 'd3-selection';
import { axisBottom, axisLeft } from 'd3-axis';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  axis: {
    '& text': {
      textRendering: 'optimizeLegibility',
      fontSize: '12px',
      stroke: 'none',
      fill: 'gray',
    },
    '& path, & line': {
      fill: 'none',
      stroke: 'lightgray',
      strokeWidth: '1px',
      shapeRendering: 'crispEdges',
    },
  },
  xAxis: {
    '& text': {
      textAnchor: 'middle',
    },
  },
  yAxis: {
    '& text': {},
  },
}));

const Axes = ({ xScale, yScale, xScaleTickFormat, yScaleTickFormat, height }) => {
  const classes = useStyles();
  const xAxisRef = useRef(null);
  const yAxisRef = useRef(null);

  useEffect(() => {
    renderXAxis();
    renderYAxis();
  });

  const renderYAxis = () => {
    const yAxis = select(yAxisRef.current);

    yAxis.call(axisLeft(yScale).ticks(4).tickFormat(yScaleTickFormat));
    yAxis.select('.domain').remove();
    yAxis.selectAll('.tick line').remove();
  };

  const renderXAxis = () => {
    const xAxis = select(xAxisRef.current);

    xAxis.call(axisBottom(xScale).tickFormat(xScaleTickFormat).ticks(5));
    xAxis.selectAll('.tick line').remove();
  };

  return (
    <g className={classes.axis}>
      <g className={classes.xAxis} transform={`translate(0,${height})`} ref={xAxisRef} />
      <g className={classes.yAxis} ref={yAxisRef} />
    </g>
  );
};
export default Axes;
