import React from 'react';
import { Delaunay } from 'd3-delaunay';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  path: {
    fill: 'transparent',
    cursor: 'pointer',
  },
}));

const Voronoi = ({ points, width, height, onMouseOver }) => {
  const classes = useStyles();
  const voronoi = Delaunay.from(
    points,
    (d) => d.x,
    (d) => d.y,
  ).voronoi([0, 0, width, height]);

  return (
    <g className="voronoi-overlay">
      {points.map((item, idx) => {
        const d = voronoi.renderCell(idx);
        return <path key={`voronoi-cell-for-${idx}`} d={d} className={classes.path} onMouseOver={onMouseOver(item)} />;
      })}
    </g>
  );
};

export default Voronoi;
