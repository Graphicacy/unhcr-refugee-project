import React from 'react';
import { makeStyles } from '@material-ui/core';
import { ascending } from 'd3-array';
import * as turf from '@turf/turf';
import resources from '../../../../assets/data/refugee_resources.json';
import { COLORS, COMMA_FORMATTER } from '../../../../constants';

const useStyles = makeStyles((theme) => ({
  subHeader: {
    textTransform: 'uppercase',
    color: COLORS.darkGray,
    fontSize: '14px',
    paddingTop: '20px',
  },
  text: {
    color: COLORS.darkGray,
  },
}));

const Resources = ({ selectedCity }) => {
  const classes = useStyles();
  const [, rows] = selectedCity;

  const featureCollection = turf.featureCollection(resources.features);

  // Get the lat/long of the selected feature and find all resource w/in a 50 mile radius
  const point = turf.point(rows.length ? rows[0]?.geometry?.coordinates : [0, 0]);
  const buffered = turf.buffer(point, 50, { units: 'miles' });
  const resourcesWithinBuffer = turf.pointsWithinPolygon(featureCollection, buffered);

  return (
    <>
      <div className={classes.subHeader}>Nearby resources for refugees (within 50 miles)</div>
      {resourcesWithinBuffer.features
        .map((resource) => ({
          ...resource,
          properties: {
            ...resource.properties,
            distance: turf.distance(point, resource, { units: 'miles' }),
          },
        }))
        .sort((a, b) => ascending(a.properties.distance, b.properties.distance))
        .map((resource) => {
          const { nonprofit_name, organization_ein, website, distance } = resource.properties;
          return (
            <div key={`resource-for-${organization_ein}`} className="resource">
              {website ? (
                <a href={website} rel="noopener noreferrer" target="_blank">
                  {`${nonprofit_name} (${COMMA_FORMATTER(distance)} miles)`}
                </a>
              ) : (
                <div className={classes.text}>{`${nonprofit_name} (${COMMA_FORMATTER(distance)} miles)`}</div>
              )}
            </div>
          );
        })}
    </>
  );
};

export default Resources;
