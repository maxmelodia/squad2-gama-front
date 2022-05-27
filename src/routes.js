import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Perfil from './pages/Perfil';
import BuscarUsuarios from './pages/BuscarUsuarios';
import Login from './pages/Login';
import NotFound from './pages/Page404';
import Register from './pages/Register';
import VerificarConexoes from './pages/VerificarConexoes';
import DashboardApp from './pages/DashboardApp';
import PlanejarViagem from './pages/PlanejarViagem';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: 'app', element: <DashboardApp /> },
        { path: 'usuarios', element: <BuscarUsuarios /> },
        { path: 'perfil', element: <Perfil /> },
        { path: 'verificar-conexoes', element: <VerificarConexoes /> },
        { path: 'planejar-viagem', element: <PlanejarViagem /> },
      ],
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/login" /> },
        // { path: '/', element: <Navigate to="/dashboard/app" /> },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
