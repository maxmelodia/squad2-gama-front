import { useState, useContext, useRef } from 'react';
import PropTypes from 'prop-types';
// material
import { alpha, styled } from '@mui/material/styles';
import { Card, Grid, Avatar, Typography, CardContent, Button, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, Stack, Divider} from '@mui/material';

// utils
import { fDate2, fDateTime2 } from '../../../utils/formatTime';
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------
import api from '../../../services/api';
import UserContext from '../../../contexts/user-context';
import Label from '../../../components/Label';
import CustomLoad from '../../../components/CustomLoad';

import DialogPlanejamento from './DialogPlanejamento';

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

const ColorButton = styled(Button)(({ theme }) => ({
  color: 'withe',
  backgroundColor: '#706DF2',
  '&:hover': {
    backgroundColor: '#FFB966',
  },
}));

// ----------------------------------------------------------------------

PlanejarViagemCard.propTypes = {
  planejamento: PropTypes.object.isRequired,
  index: PropTypes.number,
};

export default function PlanejarViagemCard({ planejamento, index, handleAtualizarCards }) {
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

  const [isLoad, setIsLoad] = useState(false);

  const pesquisarMensagens = async () => {
    setIsLoad(true);
    await api(dataUser.token)
      .get(`planejamento/${id}/mensagens`)
      .then((response) => {
        setMensagens(response.data.result); 
        setIsLoad(false);
      })
      .catch((error) => {
        console.log(error.message); 
        setIsLoad(false);
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
  
      setIsLoad(true);
      await api(dataUser.token)
        .post(`planejamento/${id}/mensagem`,body)
        .then(async () => {
          editMensagem.current.value = '';
          await pesquisarMensagens();
          setIsLoad(false);
        })
        .catch((error) => {
          console.log(error.message); 
          setIsLoad(false);
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
            <Stack p={2} direction="row" alignItems="center" justifyContent="space-between" mb={1} key={index} sx = {{background: cor, mb:3}}>
              <Typography component={'span'} sx={{ fontSize: 14 }} color="text.secondary" >
                 <Stack direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={2}> 
                  <Avatar
                    src={conexao.usuario_publicou_id === d.usuario.id ? conexao.usuario_publicou.foto : conexao.usuario_conectou.foto}
                    sx={{ width: 28, height: 28 }}
                  />
                  &nbsp;{`${d.usuario.nome}`}<br/>{`${fDateTime2(d.data_hora)} diz:`}
                 </Stack>
              </Typography>              
              <Typography component={'span'} sx={{ fontSize: 18 }} color="text.secondary"  gutterBottom>
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
              <Typography component={'span'} sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
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
                      size="medium" 
                      onClick={() => enviarMensagem()} 
                    >
                      Enviar
                    </Button>                
                  </Grid>
                  <Grid item sm={12} md={1} lg={1}>
                    <Button 
                      fullWidth
                      variant="contained" 
                      size="medium" 
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

  const handleClose = () => {
    setOpenPlanejamento(false);
    handleAtualizarCards();
  };

  const handleCloseDescricao = () => {
    setOpenDescricao(false);
  };

  const handleCloseChat = () => {
    setOpenChat(false);
  };


  return (
    <>    
      <CustomLoad openLoad={isLoad} />
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
            {situacao && (
              <Label
                variant="filled"
                color={(situacao === 'Em Andamento' && 'info') || (situacao === 'Finalizado' && 'success') || '' }
                sx={{
                  zIndex: 9,
                  top: 16,
                  right: 16,
                  position: 'absolute',
                  textTransform: 'uppercase',
                }} 
              >
                {situacao}
              </Label>
            )}          

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
              {fDate2(data_plan)}
            </Typography>         

            <TitleStyle
              to="#"
              color="inherit"
              variant="subtitle2"
              underline="hover"
              sx={{
                ...(latestPostLarge && { typography: 'h5', height: 60 }),
                ...((latestPostLarge || latestPost) && {
                  color: 'common.white',
                }),
              }}
            >
              ✨{cidade}
            </TitleStyle>

            <Divider/>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1} sx={{mb:3, mt:2}}>

            <ColorButton 
              variant="contained" 
              size="small" 
              startIcon={<Iconify icon="carbon:airline-digital-gate" />}
              onClick={() => setOpenPlanejamento(true)} 
            >
              Planejar
            </ColorButton>


            &nbsp;
            <ColorButton 
              variant="contained" 
              size="small" 
              startIcon={<Iconify icon="icon-park-outline:view-grid-detail" />}
              onClick={() => setOpenDescricao(true)} 
              >
              Descrição
            </ColorButton>

            &nbsp;
            <ColorButton 
              variant="contained" 
              size="small" 
              startIcon={<Iconify icon="icon-park-outline:wechat" />}
              onClick={async () => {
                await pesquisarMensagens();
                setOpenChat(true)
              }} 
              >
                Chat
            </ColorButton>
            </Stack>

            
          </CardContent>
        </CardAdapt>

        <DialogPlanejamento
          open={openPlanejamento}
          handleClose={handleClose}
          planejamento={planejamento}
          handleAtualizarCards={handleAtualizarCards}
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
    </>
  );

}
