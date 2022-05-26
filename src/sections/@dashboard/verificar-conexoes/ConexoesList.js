import PropTypes from 'prop-types';
// material
import { Grid } from '@mui/material';
import ConexaoCard from './ConexaoCard';

// ----------------------------------------------------------------------

ConexoesList.propTypes = {
  conexoes: PropTypes.array.isRequired
};

export default function ConexoesList({ conexoes, ...other }) {
  return (
    <Grid container spacing={3} {...other}>
      {conexoes.map((conexao) => (
        <Grid key={conexao.id} item xs={12} sm={6} md={3}> 
          <ConexaoCard conexao={conexao} /> 
        </Grid>
      ))}
    </Grid>
  );
}
