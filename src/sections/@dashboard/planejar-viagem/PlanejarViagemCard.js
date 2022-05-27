import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// material
import { alpha, styled } from '@mui/material/styles';
import { Box, Link, Card, Grid, Avatar, Typography, CardContent, Button, Tooltip } from '@mui/material';
// utils
import { fDate2 } from '../../../utils/formatTime';
import { fShortenNumber } from '../../../utils/formatNumber';
//
import SvgIconStyle from '../../../components/SvgIconStyle';
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------


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
  const { id, conexao_id, data_plan, cidade, descricao, situacao, conexao,      cover, title, view, comment, share, author, createdAt } = planejamento;

  // const latestPostLarge = index === 0;
  // const latestPost = index === 1 || index === 2;

  const latestPostLarge = false;
  const latestPost = false;

  console.log('index',index);
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

          <Button variant="contained" size="small" component={RouterLink} to="#" startIcon={<Iconify icon="carbon:airline-digital-gate" />}>
            Planejar
          </Button>
          &nbsp;
          <Button variant="contained" size="small" component={RouterLink} to="#" startIcon={<Iconify icon="icon-park-outline:view-grid-detail" />}>
            Descrição
          </Button>
        </CardContent>
      </CardAdapt>
    </Grid>
  );
}
