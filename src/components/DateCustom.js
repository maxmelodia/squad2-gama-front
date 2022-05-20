import * as React from 'react';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import Stack from '@mui/material/Stack';
import { ptBR } from "date-fns/locale";

export default function DateCustom(props) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={ptBR}>
      <Stack spacing={1}>
        <DatePicker
          {...props}
          clearable={true}
          clearText="Limpar"
          leftArrowButtonText="Voltar"
          rightArrowButtonText="Avançar"
          views={['day']}
          renderInput={(params) => 
            <TextField 
              {...params} 
              helperText={props.helperText} 
              error={props.error} 
            />}
        />
      </Stack>
    </LocalizationProvider>
  );
}
