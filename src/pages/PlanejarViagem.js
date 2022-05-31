import { useState, useEffect, useContext } from 'react';
// material
import { Grid, Container, Stack, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import { PlanejarViagemCard } from '../sections/@dashboard/planejar-viagem';
import api from '../services/api';
import UserContext from '../contexts/user-context';
import CustomLoad from '../components/CustomLoad';

export default function PlanejarViagem() {
  const { dataUser } = useContext(UserContext);
  const [planejamentos, setPlanejamentos] = useState([]);
  const [isLoad, setIsLoad] = useState(false);

  useEffect(() => {
    pesquisar();
  }, []);

  const pesquisar = async () => {
    setIsLoad(true);
    await api(dataUser.token)
      .get(`usuario/${dataUser.decoded.sub}/planejamentos`)
      .then((response) => {
        setPlanejamentos(response.data.result);
        setIsLoad(false);
      })
      .catch((error) => {
        console.log(error.message); 
        setIsLoad(false);
      });
  }; 

  return (
    <Page title="Dashboard: Blog">
      <CustomLoad openLoad={isLoad} />
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
