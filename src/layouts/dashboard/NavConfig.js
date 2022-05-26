// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: getIcon('eva:pie-chart-2-fill'),
  },
  {
    title: 'Encontrar Companhia',
    path: '/dashboard/usuarios',
    icon: getIcon('eva:people-fill'),
  },
  {
    title: 'Verificar conexões',
    path: '/dashboard/verificar-conexoes'
    ,
    icon: getIcon('eva:shopping-bag-fill'),
  },
  {
    title: 'Planejar Viagem',
    path: '/dashboard/blog',
    icon: getIcon('eva:file-text-fill'),
  },

  {
    title: 'Sair',
    path: '/',
    icon: getIcon('eva:log-out-fill'),
  },
  
  
  // {
  //   title: 'login',
  //   path: '/login',
  //   icon: getIcon('eva:lock-fill'),
  // },
  // {
  //   title: 'register',
  //   path: '/register',
  //   icon: getIcon('eva:person-add-fill'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: getIcon('eva:alert-triangle-fill'),
  // },
];

export default navConfig;
