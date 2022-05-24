import { useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText, Grid, Typography, Popover,
  Avatar, Stack, Divider } from '@mui/material';
// component
import Iconify from '../../../components/Iconify';

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
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDetalhes = (event) => {
    setObjPopover(linha)
    console.log(linha);
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

            <Typography sx={{mt:'15px'}} gutterBottom variant="subtitle1"><strong>Nome:</strong> {objPopover.nome}</Typography>
            <Typography gutterBottom variant="subtitle1"><strong>Email:</strong> {objPopover.email}</Typography>
            <Typography gutterBottom variant="subtitle1"><strong>Idade:</strong> {calculateAge(objPopover.data_nascimento)}</Typography>
            <Typography gutterBottom variant="subtitle1"><strong>CPF:</strong> {objPopover.email}</Typography>
            <Typography gutterBottom variant="subtitle1"><strong>Cidade:</strong> {objPopover.email}</Typography>

          </Grid>
          <Grid></Grid>
        </Grid>
      </Popover>

    </>
  );
}
