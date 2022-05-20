import * as Yup from 'yup';
import { useState } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import { useNavigate } from 'react-router-dom';
import { Auth } from 'aws-amplify';
// material
import { Stack, TextField, IconButton, InputAdornment, Button, Divider, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// component
import Iconify from '../components/Iconify';
import ImageUploading from "react-images-uploading";


// ----------------------------------------------------------------------

export default function Perfil() {
  const [images, setImages] = useState([]);
  const maxNumber = 1;
  const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [codigoVerificacao, setCodigoVerificacao] = useState(false);

  const RegisterSchema = Yup.object().shape({
    // firstName: Yup.string().min(2, 'Muito curto!').max(20, 'Muito Longo!').required('Usuário obrigatório'),
    // email: Yup.string().email('Email deve ser válido').required('Email obrigatório'),
    // password: Yup.string().required('Senha obrigatório'),
  });

  const formik = useFormik({
    initialValues: {
      firstName: '',
      email: '',
      password: '',
      codigoVerificacao:'',
      foto: ''
    },
    validationSchema: RegisterSchema,
    onSubmit: (values, { setSubmitting }) => {

      console.log('aaaaaaaaaaaaaaaaaa',values);      
      setSubmitting(false)
    },
  });

  async function confirmSignUp() {
    try {
      const validate = await Auth.confirmSignUp(formik.values.firstName, formik.values.codigoVerificacao);
      setCodigoVerificacao(false);
      formik.values.firstName = '';
      formik.values.email = '';
      formik.values.password = '';
      formik.values.codigoVerificacao = '';
      navigate('/', { replace: true });
    } catch (error) {
        console.log('error confirming sign up', error);
    }
  }

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <div className="App">
          <ImageUploading
            multiple
            value={images}
            onChange={onChange}
            maxNumber={maxNumber}
            dataURLKey="data_url"
          >
            {({
              imageList,
              onImageUpload,
              onImageRemoveAll,
              onImageUpdate,
              onImageRemove,
              isDragging,
              dragProps
            }) => (
              // write your building UI
              <div className="upload__image-wrapper">
                { imageList.length === 0 &&
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
                        <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:refresh-fill'} />
                    </IconButton>                 
                    <IconButton edge="end" onClick={() => {
                      formik.values.foto = '';
                      onImageRemove(index);
                      }}>
                        <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:trash-2-outline'} />
                    </IconButton>                 
                    </div>
                  </div>
                )})}
              </div>
            )}
          </ImageUploading>
        </div>

        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="Usuário"
              {...getFieldProps('firstName')}
              error={Boolean(touched.firstName && errors.firstName)}
              helperText={touched.firstName && errors.firstName}
            />
          </Stack>

          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label="Email"
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Senha"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />

          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
            Cadastrar
          </LoadingButton>
        </Stack>
      </Form>

      {
        codigoVerificacao &&
        <>
          <Stack sx={{marginTop:'30px'}} spacing={3}>
              <Divider />
              <Typography sx={{ color: 'text.secondary', mb: 5 }}>Informe o código de vericação recebido no seu e-mail.</Typography>
              <Stack direction={{ xs: 'column', sm: 'row', alignItems: 'center', justifyContent:"center", direction:"row"}} spacing={1}>
                <TextField
                  fullWidth
                  label="Código de verificação"
                  {...getFieldProps('codigoVerificacao')}
                />
                <Button fullWidth size="medium" type="button" variant="contained" color="success" onClick={confirmSignUp} >
                  Validar
                </Button>
              </Stack>
          </Stack>
        </>
      }      

    </FormikProvider>
  );
}
