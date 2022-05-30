import React, { useState, useRef, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Menu, MenuItem, ListItemIcon, ListItemText, Box, Card, Typography, Stack, IconButton, Popover, Grid, Avatar, Divider, Tooltip,
  DialogTitle, DialogContent, Dialog, DialogActions, Button  } from '@mui/material';
import { styled } from '@mui/material/styles';
// utils
// components
import Label from '../../../components/Label';
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

const ProductImgStyle = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

// ----------------------------------------------------------------------

ConexaoCard.propTypes = {
  conexao: PropTypes.object,
};

export default function ConexaoCard({ conexao }) {
  const { dataUser } = useContext(UserContext);
  const { status, usuario_conectou } = conexao;
  const [statusCard, setStatusCard] = useState('');
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [objPopover, setObjPopover] = useState({});
  const [objPopoverDestino, setObjPopoverDestino] = useState({});
  const [objPopoverPreferencias, setObjPopoverDestinoPreferencias] = useState([]);

  const colorIcons =  '#FFB966';
  const colorIcons2 =  '#706DF2';

  const [ openDetalhes, setOpenDetalhes ] = useState(false);

  useEffect(() => {
    setStatusCard(status);
  }, [status]);

  const handleDetalhes = (event) => {
    setObjPopover(conexao.usuario_conectou);
    setObjPopoverDestino(conexao.usuario_conectou.destino ? conexao.usuario_conectou.destino[0] : {});
    let prefs = [];
    if (conexao.usuario_conectou.preferencias) prefs = conexao.usuario_conectou.preferencias.sort((a, b) => a.grupo > b.grupo);
    setObjPopoverDestinoPreferencias(prefs);
    setAnchorEl(event.currentTarget);
    setOpenDetalhes(true);
  };

  const handleCloseDetalhes = () => {
    setOpenDetalhes(false);
  };

  const handleAlterarStatus = async (value = '') => {
    if (value !== '') {
      const dataConexao = {
        id: conexao.id,
        status: value
      };
  
      await api(dataUser.token)
        .put('/conexao', dataConexao)
        .then(async (response) => {
          setIsOpen(false);
          conexao.status = value;
          setStatusCard(value);
          if (value === 'Aceito') {
            const dataPlanejamento = {
              conexao_id: conexao.id,
              data_plan:  new Date(),
              cidade: '...',
              situacao: "Em Andamento"
            };

            await api(dataUser.token)
            .post('/planejamento', dataPlanejamento)
            .then(() => {
            })
            .catch((error) => {
              console.log(error.message);
            });              
          }
        })        
        .catch((error) => {
          console.log(error.message);
        });    
    };
  };

  const handleClose = () => {
    setAnchorEl(null);
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
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        {statusCard && (
          <Label
            variant="filled"
            color={(statusCard === 'Negado' && 'error') || (statusCard === 'Aberto' && 'info') || (statusCard === 'Aceito' && 'success') || (statusCard === 'Finalizado' && 'warning')}
            sx={{
              zIndex: 9,
              top: 16,
              right: 16,
              position: 'absolute',
              textTransform: 'uppercase',
            }} 
          >
            {statusCard}
          </Label>
        )}
        <ProductImgStyle alt={usuario_conectou.nome} src={usuario_conectou.foto} />  
      </Box>


      <Stack spacing={2} sx={{ p: 3 }}>
          <Typography variant="subtitle1" noWrap>
            {usuario_conectou.nome}
          </Typography>


        <Stack direction="row" alignItems="center" justifyContent="flex-start">
          <Tooltip title="Detalhes">
            <IconButton sx={{mr:1}} edge="end" onClick={(e) => handleDetalhes(e)}>
                <Iconify color={colorIcons} icon="icon-park-outline:doc-detail" width={30} height={30}/>
            </IconButton>           
          </Tooltip>
          {statusCard === 'Aberto' &&
            <Tooltip title="Checar">
              <IconButton placeholder='checar' edge="end" onClick={(e) => {
                setIsOpen(true);
                setAnchorEl2(e.currentTarget);
              }}>
                  <Iconify color={colorIcons} icon={'akar-icons:person-check'} width={30} height={30}/>
              </IconButton>           
            </Tooltip>
          }
        </Stack>
      </Stack>

 
      <Menu
        open={isOpen}
        anchorEl={anchorEl2}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' },
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem sx={{ color: 'text.secondary' }} key={faker.datatype.uuid()}>
          <ListItemIcon>
            <Iconify color={colorIcons2} icon="eva:message-circle-outline" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Aceitar" primaryTypographyProps={{ variant: 'body2' }} onClick={(e) => handleAlterarStatus('Aceito')}/>
        </MenuItem>

        <MenuItem component={RouterLink} to="#" sx={{ color: 'text.secondary' }} key={faker.datatype.uuid()}>
          <ListItemIcon>
            <Iconify color={colorIcons2} icon="eva:person-delete-outline" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Negar" primaryTypographyProps={{ variant: 'body2' }} onClick={(e) => handleAlterarStatus('Negado')}/>
        </MenuItem>

        <MenuItem component={RouterLink} to="#" sx={{ color: 'text.secondary' }} key={faker.datatype.uuid()}>
          <ListItemIcon>
            <Iconify color={colorIcons2} icon="eva:close-fill" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Finalizar" primaryTypographyProps={{ variant: 'body2' }} onClick={(e) => handleAlterarStatus('Finalizado')}/>
        </MenuItem>
      </Menu>      

      <DialogDetalhes
        open={openDetalhes}
        onClose={handleCloseDetalhes}
      /> 
      
    </Card>
  );
}
