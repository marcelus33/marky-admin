import React from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

const SearchInput: React.FC<TextFieldProps> = ({ InputProps, ...rest }) => {
  return (
    <TextField
      {...rest}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        // Spread the rest of the InputProps passed to override defaults if needed
        ...InputProps,
      }}
    />
  );
};

export default SearchInput;
