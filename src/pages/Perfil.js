import * as Yup from 'yup';
import { useState, useContext, useEffect } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import { useNavigate } from 'react-router-dom';
// material
import { Stack, TextField, IconButton, Button, Divider, Typography, Grid, Autocomplete, Tooltip } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// component
import Iconify from '../components/Iconify';
import DateCustom from '../components/DateCustom';
import CustomizedSnackbars from '../components/CustomizedSnackbars';
import CustomLoad from '../components/CustomLoad';

import ImageUploading from "react-images-uploading";
import UserContext from '../contexts/user-context';
import api from '../services/api';

// ----------------------------------------------------------------------

export default function Perfil() {
  const { dataUser } = useContext(UserContext);
  const [preferencia, setPreferencia] = useState([]);
  const [isLoad, setIsLoad] = useState(false);

  const [images, setImages] = useState([]);
  const maxNumber = 1;
  const onChange = (imageList, addUpdateIndex) => {
    setImages(imageList);
  };

  const navigate = useNavigate();

  const RegisterSchema = Yup.object().shape({
    // firstName: Yup.string().min(2, 'Muito curto!').max(20, 'Muito Longo!').required('Usuário obrigatório'),
    // email: Yup.string().email('Email deve ser válido').required('Email obrigatório'),
    // password: Yup.string().required('Senha obrigatório'),
  });

  const [usuario, setUsuario] = useState({
    nome: '', 
    email: '',
    data_nascimento: null,
    cpf: '',
    cidade: '',
    foto: '',
    telefone: '',
    descricao: '',
    destino_id: null,
    descricao_destino: '', 
    data_partida: null,
    data_retorno: null,
    cidade_destino: '',    
    preferencias: []
  })

  const formik = useFormik({
    initialValues: usuario,
    validationSchema: RegisterSchema,
    onSubmit: (values, { setSubmitting }) => {
      atualizarPerfil(values);
      setSubmitting(false);
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;
  
  const  atualizarPerfil = async (values) => {
    const usuarioUpdate = {
      id: values.id,
      nome: values.nome,
      data_nascimento: values.data_nascimento,
      cpf: values.cpf,
      cidade: values.cidade,
      foto: values.foto,
      telefone: values.telefone,
      descricao: values.descricao,
      destino: [{
        id: values.destino_id,
        descricao: values.descricao_destino, 
        data_partida: values.data_partida,
        data_retorno: values.data_retorno,
        cidade: values.cidade_destino,
      }],
      preferencias: values.preferencias
    };    

    setIsLoad(true);
    await api(dataUser.token).put(`/usuario`, usuarioUpdate)
    .then((response) => { 
        if (dataUser.user[0].foto !== values.foto) {
          dataUser.user[0].foto = values.foto;
        };
        handleClickAlert('success','Usuário atualizado com sucesso!');
        setIsLoad(false);
      })
    .catch((error) => {
      setIsLoad(false);
      console.log(error);
    });  
  };


  useEffect(() => {
    (async () => {
        setIsLoad(true);
        await api(dataUser.token).get(`/usuario/${dataUser.decoded.sub}`)
          .then(response => { 
              if (response.data.result[0].foto !== "") {
                setImages([{data_url: response.data.result[0].foto}]);
              }

              const u = response.data.result.map((value) => {
                let destino_id = '';
                let descricao = '';
                let data_partida = null;
                let data_retorno = null;
                let cidade = '';
                let preferencias = [];

                if (value.destino[0]) {
                  destino_id = value.destino[0].id;
                  descricao = value.destino[0].descricao;
                  data_partida = value.destino[0].data_partida;
                  data_retorno = value.destino[0].data_retorno;
                  cidade = value.destino[0].cidade;
                };

                if (value.preferencias) {
                  preferencias = value.preferencias;
                }

                const ret = {
                  id: value.id,
                  nome: value.nome, 
                  email: value.email,
                  data_nascimento: value.data_nascimento,
                  cpf: value.cpf,
                  cidade: value.cidade,
                  foto: value.foto,
                  telefone: value.telefone,
                  descricao: value.descricao,
                  destino_id: destino_id,
                  descricao_destino: descricao, 
                  data_partida: data_partida,
                  data_retorno: data_retorno,
                  cidade_destino: cidade, 
                  preferencias
                };

                return ret;
              });

              setUsuario(u[0]); 
              formik.setValues(u[0]);  
              setIsLoad(false);          
            })
          .catch((error) => {
            setIsLoad(false);
            console.log(error);
          });  
    })();  
  }, []);
  
  useEffect(() => {
    (async () => {
        const params = {
          lookup: true,
          orderBy: 'grupo'
        };
        setIsLoad(true); 
        await api(dataUser.token).get(`/preferencia`, {params})
          .then(response => { 
              setPreferencia(response.data.result.data);
              setIsLoad(false);
            })
          .catch((error) => {
            setIsLoad(false);
            console.log(error);
          });  
    })();  
  }, []);

  const [open, setOpen] = useState(false);
  const [severity,setSeverity] = useState('success');
  const [message,setMessage] = useState('');
  const handleClickAlert = (s, m) => {
    setSeverity(s);
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
    <FormikProvider value={formik}>
      <CustomLoad openLoad={isLoad} />
      <CustomizedSnackbars
        open={open}
        openAlert={true}
        severity={severity}
        message={message}
        handleClick={handleClickAlert}
        handleClose={handleCloseAlert}
      />
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Divider/>
        <Grid container spacing={2}>

          <Grid item sm={12} md={12} lg={12}>

          <div className="App">
            <ImageUploading
              multiple
              value={images}
              onChange={onChange}
              maxNumber={maxNumber}
              dataURLKey="data_url"
              imgExtension={[".jpg", ".gif", ".png", ".gif"]}
              maxFileSize={50000} 
            >
              {({
                imageList,
                onImageUpload,
                onImageRemoveAll,
                onImageUpdate,
                onImageRemove,
                isDragging,
                dragProps,
                errors 
              }) => { 
                
                // if (errors && errors.maxFileSize === true){
                //   handleClickAlert('error','Tamanho máximo de imagem 50kb'); 
                // }
                
                return (
                // write your building UI
                <div className="upload__image-wrapper">
                  { 
                    imageList.length === 0 &&
                    <Button fullWidth size="medium" type="button" variant="contained" color="success" onClick={onImageUpload} >
                      Adicione sua foto (Máximo 50KB)
                    </Button>
                  }

                  &nbsp;
                  {imageList.map((image, index) => {
                    formik.values.foto = image.data_url;
                    return (
                    <div key={index} className="image-item">
                      <Typography variant="caption" component="span">Máximo: 50KB</Typography>
                      
                      <img src={image.data_url} alt="" width="150" />
                      <div className="image-item__btn-wrapper">
                      <Tooltip title="Atualizar foto">                        
                        <IconButton edge="end" onClick={() => onImageUpdate(index)}>
                            <Iconify icon={'eva:refresh-fill'} />
                        </IconButton>                 
                      </Tooltip>                        
                      <Tooltip title="Excluir foto">                        
                      <IconButton edge="end" onClick={() => {
                        formik.values.foto = '';
                        onImageRemove(index);
                        }}>
                          <Iconify icon={'eva:trash-2-outline'} />
                      </IconButton>  
                      </Tooltip>                        
                      </div>
                    </div>
                  )})}
                </div>
              )}}
            </ImageUploading>
          </div>
          </Grid>

          {/* <Divider/> */}

          <Grid item sm={12} md={12} lg={12}>
            <Typography variant="h6" gutterBottom component="div">
            Usuário
            </Typography>            
          </Grid>

          <Grid item sm={12} md={4} lg={4}>
            <TextField
                fullWidth
                label="Nome"
                {...getFieldProps('nome')}
                error={Boolean(touched.firstName && errors.firstName)}
                helperText={touched.firstName && errors.firstName}
              />
          </Grid> 

          <Grid item sm={12} md={4} lg={4}>
            <TextField
              disabled
              fullWidth
              label="email"
              {...getFieldProps('email')}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
            />
          </Grid> 

          <Grid item sm={12} md={2} lg={2}>
            <DateCustom
              required
              fullWidth
              helperText={
                formik.touched.data_nascimento && formik.errors.data_nascimento
              }
              error={
                formik.touched.data_nascimento &&
                Boolean(formik.errors.data_nascimento)
              }
              label="Data Nascimento"
              name="data_nascimento"
              value={formik.values.data_nascimento}
              onChange={(date) =>
                formik.setFieldValue("data_nascimento", date)
              }
            />
          </Grid>

          <Grid item sm={12} md={42} lg={2}>
            <TextField
              fullWidth
              label="CPF"
              {...getFieldProps('cpf')}
              error={Boolean(touched.cpf && errors.cpf)}
              helperText={touched.cpf && errors.cpf}
            />
          </Grid> 

          <Grid item sm={12} md={2} lg={2}>
            <TextField
              fullWidth
              label="Telefone"
              {...getFieldProps('telefone')}
              error={Boolean(touched.telefone && errors.telefone)}
              helperText={touched.telefone && errors.telefone}
            />
          </Grid>         

          <Grid item sm={12} md={4} lg={4}>
            <TextField
              fullWidth
              label="Cidade"
              {...getFieldProps('cidade')}
              error={Boolean(touched.cidade && errors.cidade)}
              helperText={touched.cidade && errors.cidade}
            />
          </Grid>  

          <Grid item sm={12} md={6} lg={6}>
            <TextField
              multiline
              maxRows={10}            
              fullWidth
              label="Descrição/Bio"
              error={Boolean(touched.descricao && errors.descricao)}
              helperText={touched.descricao && errors.descricao}
              {...getFieldProps('descricao')}
            />
          </Grid>

          <Divider/>

          <Grid item sm={12} md={12} lg={12}>
            <Typography variant="h6" gutterBottom component="div">
            Destino
            </Typography>            
          </Grid>

          <Grid item sm={12} md={3} lg={3}>
            <TextField
              fullWidth
              label="Cidade"
              {...getFieldProps('cidade_destino')}
              error={Boolean(touched.cidade_destino && errors.cidade_destino)}
              helperText={touched.cidade_destino && errors.cidade_destino}
            />
          </Grid>    

          <Grid item sm={12} md={2} lg={2}>
            <DateCustom
              required
              fullWidth
              helperText={
                formik.touched.data_partida && formik.errors.data_partida
              }
              error={
                formik.touched.data_partida &&
                Boolean(formik.errors.data_partida)
              }
              label="Data Partida"
              name="data_partida"
              value={formik.values.data_partida}
              onChange={(date) =>
                formik.setFieldValue("data_partida", date)
              }
            />
          </Grid>

          <Grid item sm={12} md={2} lg={2}>
            <DateCustom
              required
              fullWidth
              helperText={
                formik.touched.data_retorno && formik.errors.data_retorno
              }
              error={
                formik.touched.data_retorno &&
                Boolean(formik.errors.data_retorno)
              }
              label="Data Retorno"
              name="data_retorno"
              value={formik.values.data_retorno}
              onChange={(date) =>
                formik.setFieldValue("data_retorno", date)
              }
            />
          </Grid>          

          <Grid item sm={12} md={5} lg={5}>
            <TextField
              fullWidth
              multiline
              maxRows={10}                
              label="Descrição Destino"
              {...getFieldProps('descricao_destino')}
              error={Boolean(touched.descricao_destino && errors.descricao_destino)}
              helperText={touched.descricao_destino && errors.descricao_destino}
            />
          </Grid>           


          <Grid item sm={12} md={12} lg={12}>
            <Typography variant="h6" gutterBottom component="div">
            Preferências
            </Typography>            
          </Grid>

          <Grid container spacing={2}>
            <Grid item sm={12} md={12} lg={12}>
              <Autocomplete
                multiple
                id="tags-outlined"
                options={preferencia}
                getOptionLabel={(option) => option ? `${option.grupo} - ${option.descricao}` : ''}
                filterSelectedOptions
                onChange={(e, value) =>
                  formik.setFieldValue("preferencias", value)
                }
                value={formik.values.preferencias}              
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Selecione suas preferências"
                    placeholder="..."
                  />
                )}
              />
            </Grid>                                
          </Grid>          
        </Grid> 

        <Divider/>
        
        <Grid sx={{mt:2}} container spacing={2}>
          <Grid item sm={12} md={6} lg={3}>
            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
              Atualizar Cadastro
            </LoadingButton>
          </Grid>                      
        </Grid> 

        {/* </Stack> */}
      </Form>

    </FormikProvider>
  );
}
