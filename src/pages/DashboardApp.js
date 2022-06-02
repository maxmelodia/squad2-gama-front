// @mui
import { useTheme } from '@mui/material/styles';
// components
import PaginaInicial from './PaginaInicial';


// ----------------------------------------------------------------------

export default function DashboardApp() {
  const theme = useTheme();

  return (
    <>
      <PaginaInicial/>
    </>
  );
}
