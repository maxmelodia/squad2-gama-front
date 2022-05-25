import { useState, useContext, useEffect } from 'react';
// material
import {
  Card,
  Stack,
  Avatar,
  Container, 
  Typography,
  TableContainer,
  Snackbar,
} from '@mui/material';
// components
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import { UserListToolbar, BuscarUsuariosMenu } from '../sections/@dashboard/user';
import { DataGrid, ptBR } from "@mui/x-data-grid";
import api from '../services/api';
import UserContext from '../contexts/user-context';

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

export default function BuscarUsuarios() {
  const { dataUser } = useContext(UserContext);
  const [selected, setSelected] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [dataRows, setDataRows] = useState([]);
  const [id, setId] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(1);
  const [page, setPage] = useState(0);
  const [modificado, setModificado] = useState(true);
  const [sortModel, setSortModel] = useState("-id");
  const [search, setSearch] = useState("");

  const columns = [
    { field: 'nome', headerName: 'Usuário', width: 200, renderCell: (params)=>{
      return (
        <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar alt={name} src={params.row.foto} />
          <Typography variant="subtitle2" noWrap>
            {params.row.nome}
          </Typography>
        </Stack>
      )
    } },
    {
      field: "email",
      renderHeader: () => <strong>E-mail</strong>,
      flex: 2,
    }, 
    {
      field: "cidade",
      renderHeader: () => <strong>Cidade</strong>,
      flex: 2,
    },     
    {
      field: "data_nascimento",
      renderHeader: () => <strong>Idade</strong>,
      valueGetter: (params) => calculateAge(params.row.data_nascimento),
      minWidth:80,
      maxWidth:80,      
      flex: 2,
    },       
    
    { field: 'acoes', headerName: 'Ações',
      align: "center",
      headerAlign: "center",
      minWidth:80,
      maxWidth:80,
      disableColumnMenu: true,
      sortable: false,      
      renderCell: (params)=>{
      return (
        <BuscarUsuariosMenu
          linha={params.row}
          handleRemoveUsuarioConectado={handleRemoveUsuarioConectado}
        />
      )
    } },    
  ];  

  useEffect(() => {
    pesquisar();
  }, [modificado, page, sortModel, pageSize]);

  const pesquisar = () => {
    let params = {
      limit: pageSize,
      page: page + 1,
      orderBy: sortModel,
      search,
    };

    api(dataUser.token)
      .get('/usuario', {
        params,
      })
      .then((response) => {
        const u = response.data.result.data.filter((d) => {
          let conexao = true;
          if (d.conexoes_recebidas.length > 0) {
            const fil = d.conexoes_recebidas.filter((d) => {return d.status !== 'Finalizado'});
            const con = fil.map(d => d.usuario_conectou_id);
            if (con.includes(dataUser.user[0].id)) {
              conexao = false;
            }
          };

          return (d.sub !== dataUser.decoded.sub && conexao); 
        });
        setDataRows(u);
        setTotalCount(response.data.result.totalCount);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const handleRemoveUsuarioConectado = (linha) => {
    const newData = dataRows.filter((d) => d.id !== linha.id);
    setDataRows(newData);
    showAlert('Obrigado! Aguarde até que o usuário aceite seu contato...')
  };

  const [open, setOpen] = useState(false);
  const [message,setMessage] = useState('');

  const showAlert = (m) => {
    setMessage(m);
    setOpen(true);
  };
  
  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };  

  return (
    <Page title="User">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Viajantes
          </Typography>
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName}  />

          <Scrollbar>
          <TableContainer sx={{ height: 600, width: "100%" }}>
            <DataGrid
              localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
              rows={dataRows}
              columns={columns}
              pageSize={pageSize}
              rowsPerPageOptions={[5, 10, 20]}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              rowHeight={60}
              page={page}
              onPageChange={(newPage) => setPage(newPage)}
              rowCount={totalCount}
              pagination
              paginationMode="server"
              disableColumnFilter
              onSortModelChange={(newSortModel) => {
                setSortModel("-id");
                if (newSortModel[0]?.sort) {
                  let order =
                    newSortModel[0].sort === "desc"
                      ? "-" + newSortModel[0].field
                      : newSortModel[0].field;
                  setSortModel(order);
                }
              }}
              // components={{
              //   Toolbar: CustomToolbar,
              // }}
            />
          </TableContainer>
          </Scrollbar>
        </Card>
      </Container>

      <Stack spacing={2} sx={{ width: '100%' }}>
        <Snackbar 
          open={open} 
          autoHideDuration={5000} 
          onClose={handleCloseAlert} 
          message={message}
          >
        </Snackbar>
      </Stack>
        
    </Page>
  );
}
