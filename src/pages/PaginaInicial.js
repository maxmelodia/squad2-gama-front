// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Typography, Paper, Box, Divider } from '@mui/material';
// components
import Page from '../components/Page';
import Carousel from 'react-material-ui-carousel'

import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

// ----------------------------------------------------------------------

export default function PaginaInicial() {
  const theme = useTheme();

  const items = [
    {
      name: "#1 Rio de Janeiro",
      description: "O Rio de Janeiro, é a cidade brasileira mais conhecida no exterior tem a fama de possuir um povo alegre, ávido por sol, praia, futebol e samba.",
      image: '/static/mock-images/topcidades/rj.jpg'
    },
    {
      name: "#2 Muralhas da China",
      description: "É um dos poucos destinos turísticos que realmente merecem percorrer metade do planeta. Merecem e requerem - a Grande Muralha ou Muralha da China fica exatamente do outro lado do globo e não é qualquer monumento. Trata-se da maior obra arquitetônica humana, com mais de 6 mil quilômetros de extensão.",
      image: '/static/mock-images/topcidades/china.jpg'
    },
    {
      name: "#3 Pirâmides do Egito",
      description: "Das famosas pirâmides aos grandes templos, o país exibe ao viajante milênios de uma história riquíssima, além de balneários paradisíacos.",
      image: '/static/mock-images/topcidades/egito.jpg'
    },
    {
      name: "#4 Angra - Índia",
      description: "É lá a morada do famoso Taj Mahal , Patrimônio da Humanidade da Unesco e um dos pontos turísticos mais famosos do mundo.",
      image: '/static/mock-images/topcidades/india.jpg'
    },
    {
      name: "#5 Machu Picchu",
      description: "Machu Picchu, que em língua quéchua significa “montanha velha”, está localizada sobre uma montanha de granito e abriga impressionantes construções erguidas com pesados blocos de rocha. Cercado de enigmas a respeito de sua criação e serventia, o local, declarado pela Unesco como Patrimônio Cultural e Natural da Humanidade. ",
      image: '/static/mock-images/topcidades/peru.jpg'
    },

  ];


  const itemData = [
    {
      img: '/static/mock-images/pessoas/1.jpg',
      title: 'Pessoas 1',
    },
    {
      img: '/static/mock-images/pessoas/pessoa_1.jpg',
      title: 'Pessoas 2',
    },
    {
      img: '/static/mock-images/pessoas/2.jpg',
      title: 'Pessoas 3',
    },
    {
      img: '/static/mock-images/pessoas/pessoa_2.jpg',
      title: 'Pessoas 4',
    },
    {
      img: '/static/mock-images/pessoas/3.jpg',
      title: 'Pessoas 5',
    },
    {
      img: '/static/mock-images/pessoas/pessoa_3.jpg',
      title: 'Pessoas 6',
    },
    {
      img: '/static/mock-images/pessoas/4.jpg',
      title: 'Pessoas 7',
    },
    {
      img: '/static/mock-images/pessoas/pessoa_4.jpg',
      title: 'Pessoas 8',
    },
    {
      img: '/static/mock-images/pessoas/6.jpg',
      title: 'Pessoas 9',
    },
  ];  

  function Item(props)
  {
      return (
          <Paper>
              <Box
                component="img"
                sx={{
                  height: '400px',
                  width: '100%',
                  maxHeight: { xs: '300px', md: '400px' },
                  maxWidth: { xs: '100%', md: '100%' },
                }}
                alt="The house from the offer."
                src={props.item.image}
              />              
              <h2>{props.item.name}</h2>
              <p>{props.item.description}</p>
          </Paper>
      )
  }
    
  return (
    <Page title="Dashboard">
      <Container maxWidth="lg">
        {/* <Typography variant="h4" sx={{ mb: 5 }}>
          <Iconify
              icon={'eva:globe-outline'}
              sx={{ width: 22, height: 22, ml: 1 }}
          />        
         &nbsp;  Bem Vindo Viajante...
        </Typography> */}


        <Typography variant="h5" sx={{ mb: 0 }}>
        TOP 5 destinos mais visitados segundo Veller!
        </Typography>
          <Carousel interval={6000}>{
                  items.map( (item, i) => <Item key={i} item={item} /> )
              }
          </Carousel>       

          <br/>    
          <Divider/>
          <br/>    
          <Typography variant="h5" sx={{ mb: 0 }}>
          Milhares de pessoas disponíveis para viajar!
          </Typography>
          <ImageList sx={{ width: '100%', height: 450 }} cols={3} rowHeight={164}>
            {itemData.map((item) => (
              <ImageListItem key={item.img}>
                <img
                  src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                  srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                  alt={item.title}
                  loading="lazy"
                />
              </ImageListItem>
            ))}
          </ImageList>           

      </Container>
    </Page>
  );
}
