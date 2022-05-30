// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={26} height={26} />;

const navConfig = [
  {
    title: 'Início',
    path: '/dashboard/app',
    icon: getIcon('ant-design:home-outlined'),
  },
  {
    title: 'Encontrar Companhia',
    path: '/dashboard/usuarios',
    icon: getIcon('fa6-solid:users-viewfinder'),
  },
  {
    title: 'Verificar conexões',
    path: '/dashboard/verificar-conexoes'
    ,
    icon: getIcon('ic:baseline-connect-without-contact'),
  },
  {
    title: 'Planejar Viagem',
    path: '/dashboard/planejar-viagem',
    icon: getIcon('fluent:airplane-take-off-20-filled'),
  },
  {
    title: 'Sair',
    path: '/',
    icon: getIcon('eva:log-out-fill'),
  },
];

export default navConfig;
