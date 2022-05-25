import { useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText, Grid, Typography, Popover,
  Avatar, Stack, Divider } from '@mui/material';
// component
import Iconify from '../../../components/Iconify';
import { fDate2 } from '../../../utils/formatTime';

// ----------------------------------------------------------------------

function calculateAge(dobString) {
  var dob = new Date(dobString);
  var currentDate = new Date();
  var currentYear = currentDate.getFullYear();
  var birthdayThisYear = new Date(dob.getDay(), dob.getMonth(), currentYear);
  var age = currentYear - dob.getFullYear();

  if (birthdayThisYear > currentDate) {   
     age--;
  } 
     return age;
}

export default function BuscarUsuariosMenu({linha}) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [objPopover, setObjPopover] = useState({});
  const [objPopoverDestino, setObjPopoverDestino] = useState({});
  const [objPopoverPreferencias, setObjPopoverDestinoPreferencias] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDetalhes = (event) => {
    //console.log(linha);
    setObjPopover(linha);
    setObjPopoverDestino(linha.destino ? linha.destino[0] : {});
    const prefs = linha.preferencias.sort((a, b) => a.grupo > b.grupo);
    setObjPopoverDestinoPreferencias(prefs);
    setAnchorEl(event.currentTarget);
    setIsOpen(false);
  };

  const handleConectar = () => {
    console.log('bbbbbbbbbbbbb');
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;  

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' },
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Iconify icon="eva:file-text-fill" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Mais Detalhes" primaryTypographyProps={{ variant: 'body2' }} onClick={(e) => handleDetalhes(e)} />
        </MenuItem>

        <MenuItem component={RouterLink} to="#" sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Iconify icon="eva:person-done-fill" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Conectar" primaryTypographyProps={{ variant: 'body2' }} onClick={handleConectar}/>
        </MenuItem>
      </Menu>

      <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
        <Grid container spacing={2} sx={{ margin: "10px" }}>
          <Grid>
            <Stack sx={{mb:'15px'}} direction="row" alignItems="center" spacing={2}>
            <Avatar  src={objPopover.foto} />
              <Typography variant="h6" noWrap>
                {objPopover.usuario}
              </Typography>
            </Stack> 
            <Divider/>           

            <Typography sx={{mt:'15px'}} variant="subtitle2">
              <Iconify icon="eva:person-outline" width={20} height={20} />
              <strong>Dados</strong>
            </Typography>
            <Typography variant="subtitle2"><strong>Nome:</strong> {objPopover.nome}</Typography>
            <Typography variant="subtitle2"><strong>Email:</strong> {objPopover.email}</Typography>
            <Typography variant="subtitle2"><strong>Idade:</strong> {calculateAge(objPopover.data_nascimento)}</Typography>
            <Typography variant="subtitle2"><strong>CPF:</strong> {objPopover.cpf}</Typography>
            <Typography variant="subtitle2"><strong>Cidade:</strong> {objPopover.cidade}</Typography>

            <Divider/>           
            <Typography sx={{mt:'15px'}} variant="subtitle2">
              <Iconify icon="eva:globe-2-outline" width={20} height={20} />
              <strong>Destino</strong>
            </Typography>
            <Typography sx={{mt:'15px'}} variant="subtitle2"><strong>Cidade:</strong> {objPopoverDestino?.cidade}</Typography>
            <Typography variant="subtitle2">
              <strong>Data Partida:</strong> {fDate2(objPopoverDestino?.data_partida)} &nbsp;
              <strong>Data Retorno:</strong> {fDate2(objPopoverDestino?.data_retorno)}
            </Typography>
            <Typography variant="subtitle2"><strong>Descrição:</strong> {objPopoverDestino?.descricao}</Typography>

            <Divider/>    
                   
            <Typography sx={{mt:'15px'}} variant="subtitle2">
              <Iconify icon="healthicons:ui-preferences" width={20} height={20} />
              <strong>Preferências</strong>
            </Typography>

            <Grid container spacing={1} sx={{ mt: "3px" }}>
            {objPopoverPreferencias.map((d, index) => {
              return (
                <Grid item sm={3} md={3} lg={3}>
                  <Typography variant="subtitle2" index={index}> {d.grupo} </Typography>                
                  <Typography variant="subtitle2" index={index}> {d.descricao} </Typography>                
                </Grid>
              )
            })}
            </Grid>            

          </Grid>
          <Grid></Grid>
        </Grid>
      </Popover>

    </>
  );
}
