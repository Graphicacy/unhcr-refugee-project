import React, { cloneElement } from 'react';
import { useDimensions } from '../../../../utils';

const BaseChart = ({ margin, className, children }) => {
  const [visualizationRef, { width, height, isResized }] = useDimensions({
    width: 100,
    height: 50,
    isResized: false,
  });
  if (!margin) {
    margin = {
      left: 40,
      right: 120,
      top: 40,
      bottom: 40,
    };
  }
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  return (
    <svg width={width} height={height} ref={visualizationRef} className={className}>
      <g transform={`translate(${margin.left},${margin.top})`}>
        {isResized &&
          cloneElement(children, {
            innerWidth,
            innerHeight,
            margin,
          })}
      </g>
    </svg>
  );
};

export default BaseChart;
