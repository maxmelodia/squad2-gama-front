import { useState, useEffect, useContext } from 'react';
// material
import { Container, Stack, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import { ConexoesList } from '../sections/@dashboard/verificar-conexoes';
// mock
import PRODUCTS from '../_mock/products';
import api from '../services/api';
import UserContext from '../contexts/user-context';

// ----------------------------------------------------------------------

export default function VerificarConexoes() {
  const { dataUser } = useContext(UserContext);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(1);
  const [page, setPage] = useState(0);
  const [modificado, setModificado] = useState(true);
  const [sortModel, setSortModel] = useState("-id");
  const [search, setSearch] = useState("");

  const [openFilter, setOpenFilter] = useState(false);

  const [conexoes, setConexoes] = useState([]);


  useEffect(() => {
    pesquisar();
  }, [modificado, page, sortModel, pageSize]);

  const pesquisar = async () => {
    let params = {
      limit: pageSize,
      page: page + 1,
      orderBy: sortModel,
      search,
    };

    await api(dataUser.token)
      .get(`usuario/${dataUser.decoded.sub}/conexoes`, {
        params,
      })
      .then((response) => {
        setConexoes(response.data.result);
      })
      .catch((error) => {
        console.log(error.message); 
      });
  };

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  return (
    <Page title="Dashboard: Products">
      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Conexões
        </Typography>

        <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            {/* <ProductFilterSidebar
              isOpenFilter={openFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
            /> */}
            {/* <ProductSort /> */}
          </Stack>
        </Stack>

        <ConexoesList conexoes={conexoes} /> 
        {/* <ProductCartWidget /> */}
      </Container>
    </Page>
  );
}
