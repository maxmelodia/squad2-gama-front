import { useState, useEffect, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Grid, Container, Stack, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import { PlanejarViagemCard } from '../sections/@dashboard/planejar-viagem';
import api from '../services/api';
import UserContext from '../contexts/user-context';

// // mock
// import POSTS from '../_mock/blog';


export default function PlanejarViagem() {
  const { dataUser } = useContext(UserContext);
  const [planejamentos, setPlanejamentos] = useState([]);

  useEffect(() => {
    pesquisar();
  }, []);

  const pesquisar = async () => {
    await api(dataUser.token)
      .get(`usuario/${dataUser.decoded.sub}/planejamentos`)
      .then((response) => {
        console.log(response.data.result); 
        setPlanejamentos(response.data.result);
      })
      .catch((error) => {
        console.log(error.message); 
      });
  }; 

  return (
    <Page title="Dashboard: Blog">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" >
            Viagens programadas
          </Typography>
        </Stack>
        <Grid container spacing={3}>
          {planejamentos.map((planejamento, index) => (
            <PlanejarViagemCard key={planejamento.id} planejamento={planejamento} index={index} />
          ))}
        </Grid>
      </Container>
    </Page>
  );
}
