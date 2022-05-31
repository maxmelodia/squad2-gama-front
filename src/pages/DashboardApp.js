// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';

// ----------------------------------------------------------------------

export default function DashboardApp() {
  const theme = useTheme();

  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          <Iconify
              icon={'eva:globe-outline'}
              sx={{ width: 22, height: 22, ml: 1 }}
          />        
         &nbsp;  Bem Vindo Viajantes...
        </Typography>
      </Container>
    </Page>
  );
}
