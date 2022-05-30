import React, { useRef, useState, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText, Grid, Typography, Popover, Tooltip,
  Avatar, Stack, Divider, DialogTitle, DialogContent, Dialog, DialogActions, Button } from '@mui/material';
// component
import Iconify from '../../../components/Iconify';
import { fDate2 } from '../../../utils/formatTime';
import { faker } from '@faker-js/faker';
import api from '../../../services/api';
import UserContext from '../../../contexts/user-context';  

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

export default function BuscarUsuariosMenu({linha, handleRemoveUsuarioConectado}) {
  const { dataUser } = useContext(UserContext);
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [objPopover, setObjPopover] = useState({});
  const [objPopoverDestino, setObjPopoverDestino] = useState({});
  const [objPopoverPreferencias, setObjPopoverDestinoPreferencias] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const inputEl = useRef(null);

  const [ openDetalhes, setOpenDetalhes ] = useState(false);

  const colorIcons =  '#FFB966';

  const handleDetalhes = (event) => {
    setAnchorEl(event.currentTarget);
    setObjPopover(linha);
    setObjPopoverDestino(linha.destino ? linha.destino[0] : {});
    let prefs = [];
    if (linha.preferencias) prefs = linha.preferencias.sort((a, b) => a.grupo > b.grupo);
    setObjPopoverDestinoPreferencias(prefs);
    setIsOpen(false);
    setOpenDetalhes(true);
  };

  const handleConectar = () => {
    const dataConexao = {
      usuario_publicou_id: linha.id,
      usuario_conectou_id: dataUser.user[0].id,
      data_conexao: new Date(),
      status:"Aberto"          
    };

    api(dataUser.token)
      .post('/conexao', dataConexao)
      .then((response) => {
        handleRemoveUsuarioConectado(linha);
        setIsOpen(false);
      })
      .catch((error) => {
        console.log(error.message);
      });    
  };


  const handleCloseDetalhes = () => {
    setOpenDetalhes(false);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;  


  const DialogDetalhes = (props) => {
    const { onClose, open, ...other } = props;

    const handleOk = () => {
      onClose();
    };    
 
    return (
          <Dialog
            sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 800 } }}
            maxWidth="sm"
            open={open}
            {...other}
          >
            <DialogTitle>Detalhes do Usuário
            <Typography gutterBottom variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>
                {/* Início: {fDate2(data_plan)} */}
              </Typography> 
            </DialogTitle>
            
            <DialogContent dividers>
              <Grid container spacing={2} sx={{ margin: "5px" }}>
                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <Stack sx={{mb:'5px'}} direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ height: '70px', width: '70px' }} src={objPopover.foto} />
                      <Typography variant="h6" noWrap>
                        {objPopover.usuario}
                      </Typography>
                    </Stack> 
                  </Grid>        

                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <Typography sx={{mt:'15px'}} variant="subtitle1">
                      <Iconify icon="eva:person-outline" width={20} height={20} />
                      <strong>Dados</strong>
                    </Typography>
                    <Typography variant="subtitle1"><strong>Nome:</strong> {objPopover.nome}</Typography>
                    <Typography variant="subtitle1"><strong>Email:</strong> {objPopover.email}</Typography>
                    <Typography variant="subtitle1"><strong>Idade:</strong> {calculateAge(objPopover.data_nascimento)}</Typography>
                    <Typography variant="subtitle1"><strong>CPF:</strong> {objPopover.cpf}</Typography>
                    <Typography variant="subtitle1"><strong>Cidade:</strong> {objPopover.cidade}</Typography>
                  </Grid>

                  <Divider/>    

                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Typography sx={{mt:'15px'}} variant="subtitle1">
                      <Iconify icon="eva:globe-2-outline" width={20} height={20} />
                      <strong>Destino</strong>
                    </Typography>
                    <Typography sx={{mt:'10px'}} variant="subtitle1"><strong>Cidade:</strong> {objPopoverDestino?.cidade}</Typography>
                    <Typography variant="subtitle1">
                      <strong>Data Partida:</strong> {fDate2(objPopoverDestino?.data_partida)} &nbsp;
                      <strong>Data Retorno:</strong> {fDate2(objPopoverDestino?.data_retorno)}
                    </Typography>
                    <Typography variant="subtitle1"><strong>Descrição:</strong> {objPopoverDestino?.descricao}</Typography>
                  </Grid>

                  <Divider/>    
                        
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Typography sx={{mt:'10px'}} variant="subtitle1">
                      <Iconify icon="healthicons:ui-preferences" width={20} height={20} />
                      <strong>Preferências</strong>
                    </Typography>

                    <Grid container spacing={1} sx={{ mt: "3px" }}>
                      {objPopoverPreferencias.map((d, index) => {
                        return (
                          <React.Fragment key={index}>
                            <Grid item sm={3} md={3} lg={3} >
                              <Typography variant="subtitle1"> {d.grupo} </Typography>                
                              <Typography variant="subtitle1" sx={{color:'blue'}}> {d.descricao} </Typography>                
                            </Grid>
                          </React.Fragment>
                        )
                      })}
                    </Grid>                
                  </Grid>                
              </Grid>              
              
            </DialogContent>
            <DialogActions disableSpacing>
              <Button onClick={handleOk}>Ok</Button>
            </DialogActions>
          </Dialog>
    );
  };  

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
      </IconButton>

      <Menu
        ref={inputEl}
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' },
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem sx={{ color: 'text.secondary' }} key={faker.datatype.uuid()}>
          <Tooltip title="Detalhes">
            <ListItemIcon>
              <Iconify color={colorIcons} icon="icon-park-outline:doc-detail" width={24} height={24} />
            </ListItemIcon>
          </Tooltip>          
          <ListItemText primary="Mais Detalhes" primaryTypographyProps={{ variant: 'body2' }} onClick={(e) => handleDetalhes(e)}/>
        </MenuItem>

        <MenuItem component={RouterLink} to="#" sx={{ color: 'text.secondary' }} key={faker.datatype.uuid()}>
          <ListItemIcon>
            <Iconify color={colorIcons} icon="ic:twotone-connect-without-contact" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Conectar" primaryTypographyProps={{ variant: 'body2' }} onClick={handleConectar} />
        </MenuItem>
      </Menu>

      <DialogDetalhes
        open={openDetalhes}
        onClose={handleCloseDetalhes}
      />

    </>
  );
}
