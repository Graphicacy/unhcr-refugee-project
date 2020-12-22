import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import searchIcon from '../../../../assets/images/search.svg';
import { COLORS } from '../../../../constants';

const useStyles = makeStyles((theme) => ({
  input: {
    backgroundColor: COLORS.lightRed,
    borderRadius: '5px',
    color: COLORS.white,
    '& img': {
      padding: '5px 10px',
    },
  },
  innerInput: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
}));

const CitySearch = ({ searchText, setSearchText }) => {
  const classes = useStyles();

  return (
    <TextField
      className={classes.input}
      id="city-search"
      placeholder="Search for a City"
      value={searchText}
      onChange={(evt) => setSearchText(evt.target.value)}
      InputProps={{
        className: classes.innerInput,
        startAdornment: (
          <InputAdornment position="start">
            <img alt="Magnifying glass representing how to search for a city in the US" src={searchIcon} />
          </InputAdornment>
        ),
      }}
    />
  );
};
export default CitySearch;
