import * as Yup from 'yup';
import { useState, useContext, useEffect } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import { useNavigate } from 'react-router-dom';
// material
import { Stack, TextField, IconButton, Button, Divider, Typography, Grid } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// component
import Iconify from '../components/Iconify';
import DateCustom from '../components/DateCustom';
import CustomizedSnackbars from '../components/CustomizedSnackbars';

import ImageUploading from "react-images-uploading";
import UserContext from '../contexts/user-context';
import api from '../services/api';

// ----------------------------------------------------------------------

export default function Perfil() {
  const { dataUser } = useContext(UserContext);

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
    telefone: ''
  })

  const formik = useFormik({
    initialValues: usuario,
    validationSchema: RegisterSchema,
    onSubmit: (values, { setSubmitting }) => {
      atualizarPerfil(values);
      setSubmitting(false)
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;
  
  const  atualizarPerfil = async (values) => {

    const usuarioUpdate = {
      id: values.id,
      data_nascimento: values.data_nascimento,
      cpf: values.cpf,
      cidade: values.cidade,
      foto: values.foto,
      telefone: values.telefone
    };    

    await api(dataUser.token).put(`/usuario`, usuarioUpdate)
    .then(() => { 
        if (dataUser.user[0].foto !== values.foto) {
          dataUser.user[0].foto = values.foto;
        };
        handleClickAlert('success','Usuário atualizado com sucesso!');
      })
    .catch((error) => {
      console.log(error);
    });  
  };


  useEffect(() => {
    (async () => {
        await api(dataUser.token).get(`/usuario/${dataUser.decoded.sub}`)
          .then(response => { 
              if (response.data.result[0].foto !== "") {
                setImages([{data_url: response.data.result[0].foto}]);
              }
              setUsuario(response.data.result[0]); 
              //console.log(response.data.result[0]);
              formik.setValues(response.data.result[0]);            
            })
          .catch((error) => {
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
              
              if (errors && errors.maxFileSize === true){
                handleClickAlert('error','Tamanho máximo de imagem 50kb') 
              }
              
              return (
              // write your building UI
              <div className="upload__image-wrapper">
                { 
                  imageList.length === 0 &&
                  <Button fullWidth size="medium" type="button" variant="contained" color="success" onClick={onImageUpload} >
                    Adicione sua foto
                  </Button>
                }

                &nbsp;
                {imageList.map((image, index) => {
                  formik.values.foto = image.data_url;
                  return (
                  <div key={index} className="image-item">
                    <img src={image.data_url} alt="" width="150" />
                    <div className="image-item__btn-wrapper">
                    <IconButton edge="end" onClick={() => onImageUpdate(index)}>
                        <Iconify icon={'eva:refresh-fill'} />
                    </IconButton>                 
                    <IconButton edge="end" onClick={() => {
                      formik.values.foto = '';
                      onImageRemove(index);
                      }}>
                        <Iconify icon={'eva:trash-2-outline'} />
                    </IconButton>                 
                    </div>
                  </div>
                )})}
              </div>
            )}}
          </ImageUploading>
        </div>

        <Stack spacing={3}>
        <Divider/>

        <Grid container spacing={2}>
          <Grid item sm={12} md={6} lg={6}>
            <TextField
                fullWidth
                label="Nome"
                {...getFieldProps('nome')}
                error={Boolean(touched.firstName && errors.firstName)}
                helperText={touched.firstName && errors.firstName}
              />
          </Grid> 
          <Grid item sm={12} md={6} lg={6}>
            <TextField
              disabled
              fullWidth
              label="email"
              {...getFieldProps('email')}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
            />
          </Grid> 

          <Grid item sm={12} md={4} lg={2}>
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
          <Grid item sm={12} md={4} lg={2}>
            <TextField
              fullWidth
              label="CPF"
              {...getFieldProps('cpf')}
              error={Boolean(touched.cpf && errors.cpf)}
              helperText={touched.cpf && errors.cpf}
            />
          </Grid> 
          <Grid item sm={12} md={4} lg={2}>
            <TextField
              fullWidth
              label="Telefone"
              {...getFieldProps('telefone')}
              error={Boolean(touched.telefone && errors.telefone)}
              helperText={touched.telefone && errors.telefone}
            />
          </Grid>           


          <Grid item sm={12} md={12} lg={6}>
            <TextField
              fullWidth
              label="Cidade"
              {...getFieldProps('cidade')}
              error={Boolean(touched.cidade && errors.cidade)}
              helperText={touched.cidade && errors.cidade}
            />
          </Grid>  

          <Grid item sm={12} md={12} lg={12}>
            <TextField
              multiline
              maxRows={10}            
              fullWidth
              label="Descrição/Bio"
              {...getFieldProps('descricao')}
              error={Boolean(touched.descricao && errors.descricao)}
              helperText={touched.descricao && errors.descricao}
            />
          </Grid>                      
        </Grid> 

        <Divider/>
        <Grid container spacing={2}>
          <Grid item sm={12} md={6} lg={2}>
            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
              Atualizar Cadastro
            </LoadingButton>
          </Grid>                      
        </Grid> 

        </Stack>
      </Form>

    </FormikProvider>
  );
}
