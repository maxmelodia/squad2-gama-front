import { useState, useEffect, useContext, useRef } from 'react';
import PropTypes from 'prop-types';
// material
import { alpha, styled } from '@mui/material/styles';
import { Card, Grid, Avatar, Typography, CardContent, Button, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, MenuItem, Select, Stack, } from '@mui/material';

import DateCustom from '../../../components/DateCustom';

// utils
import { fDate2, fDateTime2 } from '../../../utils/formatTime';
import { fShortenNumber } from '../../../utils/formatNumber';
//
import SvgIconStyle from '../../../components/SvgIconStyle';
import Iconify from '../../../components/Iconify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
// ----------------------------------------------------------------------
import api from '../../../services/api';
import UserContext from '../../../contexts/user-context';


const CardAdapt = styled(Card)({
  position: 'relative',
  //minWidth: 310,
  //maxWidth: 310,
  transition: "transform 0.15s ease-in-out",
  "&:hover": { transform: "scale3d(1.05, 1.05, 1)" },
});

const CardMediaStyle = styled('div')({
  position: 'relative',
  paddingTop: 'calc(100% * 3 / 4)',
});

const TitleStyle = styled(Typography)({
  height: 44,
  overflow: 'hidden',
  WebkitLineClamp: 2,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
});

const AvatarStyle = styled(Avatar)(({ theme }) => ({
  zIndex: 9,
  width: 48,
  height: 48,
  position: 'absolute',
  left: theme.spacing(3),
  bottom: theme.spacing(-2),
}));

const AvatarStyle2 = styled(Avatar)(({ theme }) => ({
  zIndex: 9,
  width: 48,
  height: 48,
  position: 'absolute',
  left: theme.spacing(10),
  bottom: theme.spacing(-2),
}));

const InfoStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  marginTop: theme.spacing(3),
  color: theme.palette.text.disabled,
}));

const CoverImgStyle = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

// ----------------------------------------------------------------------

PlanejarViagemCard.propTypes = {
  planejamento: PropTypes.object.isRequired,
  index: PropTypes.number,
};

export default function PlanejarViagemCard({ planejamento, index }) {
  const { dataUser } = useContext(UserContext);
  const editMensagem = useRef();
  const { id, conexao_id, data_plan = null, cidade = '', descricao = '', situacao, conexao,      cover, title, view, comment, share, author, createdAt } = planejamento;

  // const latestPostLarge = index === 0;
  // const latestPost = index === 1 || index === 2;

  const latestPostLarge = false;
  const latestPost = false;

  const [ openPlanejamento, setOpenPlanejamento ] = useState(false);
  const [ openDescricao, setOpenDescricao ] = useState(false);
  const [ openChat, setOpenChat ] = useState(false);

  const [ mensagens, setMensagens ] = useState(null);

  const [plan, setPlan] = useState({
    id: null,
    conexao_id: null,
    data_plan: null,
    cidade: '',
    descricao: '',
    situacao: '',
  });

  const RegisterSchema = Yup.object().shape({
    // firstName: Yup.string().min(2, 'Muito curto!').max(20, 'Muito Longo!').required('Usuário obrigatório'),
    // email: Yup.string().email('Email deve ser válido').required('Email obrigatório'),
    // password: Yup.string().required('Senha obrigatório'),
  });  

  const formik = useFormik({
    initialValues: plan,
    validationSchema: RegisterSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
        formik.setSubmitting(false);
        //update(values);
    },
  });  
  

  useEffect(() => {
    formik.setValues({
      id: id,
      conexao_id: conexao_id,
      data_plan: data_plan,
      cidade: cidade,
      descricao: descricao || '',
      situacao: situacao,
    });    
  },[]);

  const pesquisarMensagens = async () => {
    await api(dataUser.token)
      .get(`planejamento/${id}/mensagens`)
      .then((response) => {
        setMensagens(response.data.result); 
      })
      .catch((error) => {
        console.log(error.message); 
      });
  };

  const enviarMensagem = async () => {
    if (editMensagem.current.value !== "") {
      const body = {
        planejamento_id: id,
        usuario_id: dataUser.user[0].id,
        data_hora: new Date(),
        mensagem: editMensagem.current.value
      };
  
      await api(dataUser.token)
        .post(`planejamento/${id}/mensagem`,body)
        .then(async () => {
          editMensagem.current.value = '';
          await pesquisarMensagens();
        })
        .catch((error) => {
          console.log(error.message); 
        });

    };

  };  

  const DialogChat = (props) => {
    const { contentMensagem, onClose, open, ...other } = props;

    const handleOk = () => {
      onClose();
    };    

    let contentChat = null;
    if (contentMensagem) {
      let cor = '';
      contentChat = contentMensagem.map((d, index) => {
        if (cor === '#fff5d6') {
           cor = '#f3f1ff';          
        } else {
          cor = '#fff5d6';
        }

        return (
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1} index={index}  sx = {{background: cor, mb:3}}>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" >
                 <Stack direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={2}> 
                  <Avatar
                    src={conexao.usuario_publicou_id === d.usuario.id ? conexao.usuario_publicou.foto : conexao.usuario_conectou.foto}
                    sx={{ width: 28, height: 28 }}
                  />
                  &nbsp;{`${d.usuario.nome}`}<br/>{`${fDateTime2(d.data_hora)} diz:`}
                 </Stack>
              </Typography>              
              <Typography sx={{ fontSize: 18 }} color="text.secondary"  gutterBottom>
                {d.mensagem}
              </Typography>
            </Stack>
        ); 
      });
    }
 
    return (
          <Dialog
            sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 800 } }}
            maxWidth="md"
            open={open}
            {...other}
          >
            <DialogTitle>Chat...
            <Typography gutterBottom variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>
                Início: {fDate2(data_plan)}
              </Typography> 
            </DialogTitle>
            
            <DialogContent dividers>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              {contentChat}
              </Typography>
             
            </DialogContent>
            <DialogActions disableSpacing sx={{mb:3, mt:3, ml:3, mr:3}}>
              <Grid container spacing={2} direction="row" justifyContent="center" alignItems="center">  
                  <Grid item sm={12} md={10} lg={10}>
                    <TextField
                        inputRef={editMensagem}
                        size="small" 
                        fullWidth
                        label="Mensagem"
                        name="editMensagem"
                      />              
                  </Grid>
                  <Grid item sm={12} md={1} lg={1}>
                    <Button 
                      fullWidth
                      variant="contained" 
                      size="small" 
                      onClick={() => enviarMensagem()} 
                    >
                      Enviar
                    </Button>                
                  </Grid>
                  <Grid item sm={12} md={1} lg={1}>
                    <Button 
                      fullWidth
                      variant="contained" 
                      size="small" 
                      onClick={handleOk}
                    >
                      Fechar
                    </Button>                
                  </Grid>
              </Grid>              
            </DialogActions>
          </Dialog>
    );
  };

  const DialogDescricao = (props) => {
    const { onClose, open, ...other } = props;

    const handleOk = () => {
      onClose();
    };    
 
    return (
          <Dialog
            sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 400 } }}
            maxWidth="sm"
            open={open}
            {...other}
          >
            <DialogTitle>Descrição da Viagem
            <Typography gutterBottom variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>
                Início: {fDate2(data_plan)}
              </Typography> 
            </DialogTitle>
            
            <DialogContent dividers>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              ✨{descricao}
              </Typography>
            </DialogContent>
            <DialogActions disableSpacing>
              <Button onClick={handleOk}>Ok</Button>
            </DialogActions>
          </Dialog>
    );
  };


  const DialogCustom = (props) => {
    //const { onClose, value: valueProp, open, ...other } = props;
    const { onClose, open, ...other } = props;

    const handleCancel = () => {
      onClose();
    }; 
    const handleOk = () => {
      onClose();
    };    
 
    return (
          <Dialog
            sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 800 } }}
            maxWidth="md"
            //TransitionProps={{ onEntering: handleEntering }}
            open={open}
            {...other}
          >
            <DialogTitle>Planejar Viagem
            <Typography gutterBottom variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>
                Início: {fDate2(data_plan)}
              </Typography> 
            </DialogTitle>
            
            <DialogContent dividers>
              <form noValidate onSubmit={formik.handleSubmit}>

                <Grid container spacing={2}>  
                        
                  <Grid item sm={12} md={9} lg={9}>
                    <TextField
                        fullWidth
                        label="Cidade Destino"
                        name="cidade"
                        value={formik.values.cidade ? formik.values.cidade : '' } 
                        onChange={formik.handleChange}
                        error={formik.touched.cidade && Boolean(formik.errors.cidade)}
                        helperText={formik.touched.cidade && formik.errors.cidade}                            
                      />
                  </Grid> 
   
                  <Grid item sm={12} md={3} lg={3}>
                    <Select
                      fullWidth
                      label="Status"
                      value={formik.values.situacao}
                    >
                      <MenuItem value={'Em Andamento'}>Em Andamento</MenuItem> 
                      <MenuItem value={'Finalizado'}>Finalizado</MenuItem>
                    </Select>
                  </Grid> 

                  <Grid item sm={12} md={12} lg={12}>
                  <TextField
                      fullWidth
                      multiline
                      rows={5}
                      label="Informações da viagem"
                      name="descricao"
                      onChange={formik.handleChange}
                      value={formik.values.descricao ? formik.values.descricao : '' } 
                      error={Boolean(formik.touched.descricao && formik.errors.descricao)}
                      helperText={formik.touched.descricao && formik.errors.descricao}
                    />
                  </Grid> 
                           
                </Grid>
              </form>        
            </DialogContent>
            <DialogActions disableSpacing>
              <Button onClick={handleCancel}>
                Cancelar
              </Button>
              <Button onClick={handleOk}>Ok</Button>
            </DialogActions>
          </Dialog>
    );
  };


  const handleClose = (newValue) => {
    setOpenPlanejamento(false);

    if (newValue) {
      setValue(newValue);
    }
  };

  const handleCloseDescricao = (newValue) => {
    setOpenDescricao(false);
  };

  const handleCloseChat = (newValue) => {
    setOpenChat(false);
  };


  return (
    // <Grid item xs={12} sm={latestPostLarge ? 12 : 6} md={latestPostLarge ? 6 : 3}>
    <Grid item xs={12} sm={6} md={6} lg={4}>
      <CardAdapt>
        <CardMediaStyle
          sx={{
            ...((latestPostLarge || latestPost) && {
              pt: 'calc(100% * 4 / 3)',
              '&:after': {
                top: 0,
                content: "''",
                width: '100%',
                height: '100%',
                position: 'absolute',
                bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
              },
            }),
            ...(latestPostLarge && {
              pt: {
                xs: 'calc(100% * 4 / 3)',
                sm: 'calc(100% * 3 / 4.66)',
              },
            }),
          }}
        >
          {/* <SvgIconStyle
            color="paper"
            src="/static/icons/shape-avatar.svg"
            sx={{
              width: 80,
              height: 36,
              zIndex: 9,
              bottom: -15,
              position: 'absolute',
              color: 'background.paper',
              ...((latestPostLarge || latestPost) && { display: 'none' }), 
            }}
          /> */}

          <Tooltip title={conexao.usuario_publicou.nome}>
            <AvatarStyle
              alt={conexao.usuario_publicou.nome}
              src={conexao.usuario_publicou.foto}
              sx={{
                ...((latestPostLarge || latestPost) && {
                  zIndex: 9,
                  top: 24,
                  left: 24,
                  width: 50,
                  height: 50,
                }),
              }}
            />
          </Tooltip>

          <Tooltip title={conexao.usuario_conectou.nome}>
            <AvatarStyle2
              alt={conexao.usuario_conectou.nome}
              src={conexao.usuario_conectou.foto}
              sx={{
                ...((latestPostLarge || latestPost) && {
                  zIndex: 9,
                  top: 24,
                  left: 80,
                  width: 50,
                  height: 50,
                }),
              }}
            />
          </Tooltip>

          <CoverImgStyle alt={'title'} src={`/static/mock-images/cidades/cidade_${index}.jpg`} />
        </CardMediaStyle>

        <CardContent
          sx={{
            pt: 4,
            ...((latestPostLarge || latestPost) && {
              bottom: 0,
              width: '100%',
              position: 'absolute',
            }),
          }}
        >
          <Typography gutterBottom variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>
            {/* {fDate(createdAt)} */}
            {/* {createdAt} */}
            {fDate2(data_plan)}
          </Typography>         

          <TitleStyle
            to="#"
            color="inherit"
            variant="subtitle2"
            underline="hover"
            //component={RouterLink}
            sx={{
              ...(latestPostLarge && { typography: 'h5', height: 60 }),
              ...((latestPostLarge || latestPost) && {
                color: 'common.white',
              }),
            }}
          >
            ✨{cidade}
          </TitleStyle>

          <Button 
            variant="contained" 
            size="small" 
            startIcon={<Iconify icon="carbon:airline-digital-gate" />}
            onClick={() => setOpenPlanejamento(true)} 
          >
            Planejar
          </Button>


          &nbsp;
          <Button 
            variant="contained" 
            size="small" 
            startIcon={<Iconify icon="icon-park-outline:view-grid-detail" />}
            onClick={() => setOpenDescricao(true)} 
            >
            Descrição
          </Button>
          &nbsp;
          <Button 
            variant="contained" 
            size="small" 
            startIcon={<Iconify icon="icon-park-outline:wechat" />}
            onClick={async () => {
              await pesquisarMensagens();
              setOpenChat(true)
            }} 
            >
              Chat
          </Button>

          
        </CardContent>
      </CardAdapt>

      <DialogCustom
        open={openPlanejamento}
        onClose={handleClose}
      />

      <DialogDescricao
        open={openDescricao}
        onClose={handleCloseDescricao}
      />

      <DialogChat
        open={openChat}
        onClose={handleCloseChat}
        contentMensagem={mensagens}        
      />

    </Grid>
  );

}
