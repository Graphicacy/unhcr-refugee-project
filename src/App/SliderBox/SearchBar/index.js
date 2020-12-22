import React, { useState } from 'react';
import { MAPBOX_TOKEN } from '../../../constants';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useDebouncedSearch } from '../../../utils';
import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const fetchGeocodedLocations = async (id) =>
  (
    await fetch(
      `https://api.tiles.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(id)}.json?access_token=${MAPBOX_TOKEN}&country=US`,
    )
  ).json();
const useSearchHero = () => useDebouncedSearch((text) => fetchGeocodedLocations(text));

const useStyles = makeStyles((theme) => ({
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
  },
}));

const SearchBar = ({ onSubmit }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const { inputText, setInputText, searchResults } = useSearchHero();
  const options = searchResults.result?.features || [];
  const loading = open && options.length === 0;

  return (
    <Autocomplete
      id="search-for-a-location"
      style={{ width: '100%' }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      getOptionSelected={(option, value) => option.place_name === value.place_name}
      getOptionLabel={(option) => option.place_name}
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          value={inputText}
          label="Search for a location"
          variant="outlined"
          onChange={(e) => setInputText(e.target.value)}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
      renderOption={(option) => {
        return (
          <Grid container alignItems="center" onClick={() => onSubmit(option)}>
            <Grid item>
              <LocationOnIcon className={classes.icon} />
            </Grid>
            <Grid item xs>
              <Typography variant="body2" color="textSecondary">
                {option.place_name}
              </Typography>
            </Grid>
          </Grid>
        );
      }}
    />
  );
};
export default SearchBar;
