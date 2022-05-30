import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
//
import DashboardNavbar from './DashboardNavbar';
import DashboardSidebar from './DashboardSidebar';
import UserContext from '../../contexts/user-context';
import api from '../../services/api';
// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const RootStyle = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden'
});

const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  let dataUser = localStorage.getItem('squad2User') ? JSON.parse(localStorage.getItem('squad2User')) : { username: 'O' };
  const [open, setOpen] = useState(false);
  const [conexoesEmAberto, setConexoesEmAberto] = useState([]);
  
  // useEffect(() => {
  //   pesquisar();
  // }, []);


  // const pesquisar = async () => {
  //   let params = {
  //     limit: 100,
  //   };

  //   await api(dataUser.token)
  //     .get(`usuario/${dataUser.decoded.sub}/conexoes`, {
  //       params,
  //     })
  //     .then((response) => {
  //       let con = response.data.result.filter(d => d.status === 'Aberto'); 
  //       setConexoesEmAberto(con); 
  //     })
  //     .catch((error) => {
  //       console.log(error.message); 
  //     });
  // };  

  return (
      <UserContext.Provider value={{dataUser}}>
        <RootStyle>
          <DashboardNavbar onOpenSidebar={() => setOpen(true)} conexoesEmAberto={conexoesEmAberto} />
          <DashboardSidebar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
          <MainStyle>
            <Outlet />
          </MainStyle>
        </RootStyle>
      </UserContext.Provider>    
  );
}
