import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { MenuItem, FormControl, Select, InputBase } from '@material-ui/core';
import { COLORS } from '../../../../constants';

const BootstrapInput = withStyles((theme) => ({
  root: {
    'label + &': {
      color: COLORS.white,
      marginTop: theme.spacing(3),
    },
  },
  input: {
    color: COLORS.white,
    padding: '6.5px 26px 6.5px 16px',
  },
}))(InputBase);

const useStyles = makeStyles((theme) => ({
  formControl: {
    display: 'flex',
    flexDirection: 'row',
    width: 'calc(100% - 5px)',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: '5px',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  label: {
    color: COLORS.white,
    fontSize: '14px',
    paddingRight: theme.spacing(1),
  },
  select: {
    width: '142px',
    fontSize: '16px',
    fontWeight: 'bold',
    borderRadius: 5,
    backgroundColor: COLORS.lightRed,
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.2)',
    '.MuiSelect-select': {
      paddingLeft: theme.spacing(1),
    },
    '&:hover:not(.Mui-disabled):before, &:before': {
      display: 'none',
    },
    '&:after': {
      display: 'none',
    },
  },
}));

const CustomSelect = ({ items, selectedItem, onChange, label, id = 'calendar-year-select' }) => {
  const classes = useStyles();

  return (
    <FormControl className={classes.formControl}>
      <div className={classes.label}>{label}</div>
      <Select value={selectedItem} onChange={(evt) => onChange(evt.target.value)} className={classes.select} input={<BootstrapInput />}>
        {items.map((item) => {
          return (
            <MenuItem key={`${id}-menu-item-${item}`} value={item}>
              {item}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};
export default CustomSelect;
