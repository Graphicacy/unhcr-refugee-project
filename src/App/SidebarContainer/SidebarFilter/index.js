import React, { useEffect, useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { COLORS } from '../../../constants';
import CloseIcon from '@material-ui/icons/Close';
import { ascending, groups } from 'd3-array';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { Button } from '@material-ui/core';

const WhiteCheckbox = withStyles({
  root: {
    color: COLORS.white,
    '&$checked': {
      color: COLORS.white,
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: COLORS.darkRed,
  },
  headerContainer: {
    padding: '0 0 0 25px',
    flex: '0 0 calc(100% - 88px)',
    height: 'calc(100% - 88px)',
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
  regionContainer: {
    display: 'flex',
    flexDirection: 'column',
    '& .header': {
      '& .MuiTypography-root.MuiFormControlLabel-label.MuiTypography-body1': {
        fontWeight: 'bold',
      },
    },
    paddingBottom: '25px',
  },
  regionOuterContainer: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '16px',
    color: COLORS.white,
    flex: '1 1 100%',
    overflowY: 'auto',
  },
  buttonContainer: {
    display: 'flex',
    padding: '25px',
    boxShadow: '0 0 6px 0 rgba(0, 0, 0, 0.16)',
    '& button': {
      color: COLORS.white,
      border: `1px ${COLORS.lightRed} solid`,
      fontWeight: 'bold',
      backgroundColor: COLORS.darkRed,
      '&:not(:last-child)': {
        marginRight: '15px',
      },
      '&.apply': {
        backgroundColor: COLORS.lightRed,
      },
      '&:hover': {
        backgroundColor: COLORS.lightRed,
      },
    },
  },
}));

const SidebarFilter = ({ state, setState, nationalities }) => {
  const classes = useStyles();

  const { selectedNationalities } = state;
  const nestedNationalities = groups(nationalities, ([, region]) => region);
  const onlyNationalities = new Set(nationalities.map(([country]) => country));
  const [localNationalities, setLocalNationalities] = useState(
    selectedNationalities.length ? new Set(selectedNationalities) : onlyNationalities,
  );

  useEffect(() => {
    setLocalNationalities(selectedNationalities.length ? new Set(selectedNationalities) : onlyNationalities);
  }, [selectedNationalities, onlyNationalities]);

  const onRegionChange = (values, isRegionChecked) => () => {
    const xs = values.map(([country]) => country);
    if (isRegionChecked) {
      // deselect all in the region
      setLocalNationalities(new Set([...localNationalities].filter((x) => !xs.includes(x))));
    } else {
      // select all in the region
      setLocalNationalities(new Set([...localNationalities, ...new Set(xs)]));
    }
  };

  const onCountryChange = (value) => () => {
    // Add/remove from nationalities list
    const country = new Set([value]);
    if (localNationalities.has(value)) {
      setLocalNationalities(new Set([...localNationalities].filter((x) => !country.has(x))));
    } else {
      setLocalNationalities(new Set([...localNationalities, ...country]));
    }
  };

  const onApply = () =>
    setState((prevState) => ({
      ...prevState,
      selectedNationalities: localNationalities.size === onlyNationalities.length ? [] : Array.from(localNationalities),
      isFilterOpen: false,
    }));

  const onClear = () => setLocalNationalities(new Set([]));

  return (
    <div className={classes.container}>
      <div className={classes.close}>
        <CloseIcon
          className={classes.closeIcon}
          onClick={() =>
            setState((prevState) => ({
              ...prevState,
              isFilterOpen: false,
            }))
          }
        />
      </div>
      <div className={classes.headerContainer}>
        <h2>Select Country of Origin</h2>
        <div className={classes.regionOuterContainer}>
          {nestedNationalities
            .sort((a, b) => ascending(a[0], b[0]))
            .map(([region, values]) => {
              const isRegionChecked = values.every(([country]) => localNationalities.has(country));
              return (
                <div className={classes.regionContainer} key={`group-section-for-${region}`}>
                  <FormControlLabel
                    className="header"
                    control={<WhiteCheckbox checked={isRegionChecked} onChange={onRegionChange(values, isRegionChecked)} name={region} />}
                    label={`${region} (select all)`}
                  />
                  {values
                    .sort((a, b) => ascending(a[0], b[0]))
                    .map(([value]) => {
                      return (
                        <FormControlLabel
                          key={`nationality-value-for-${value}`}
                          control={<WhiteCheckbox checked={localNationalities.has(value)} onChange={onCountryChange(value)} name={value} />}
                          label={value}
                        />
                      );
                    })}
                </div>
              );
            })}
        </div>
      </div>
      <div className={classes.buttonContainer}>
        <Button disabled={!localNationalities.size} onClick={onApply} variant="contained" className="apply">
          Apply
        </Button>
        <Button onClick={onClear} variant="contained">
          Clear
        </Button>
      </div>
      ;
    </div>
  );
};

export default SidebarFilter;
