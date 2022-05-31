import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import { Auth } from 'aws-amplify';
import jwt_decode from "jwt-decode";
import api from '../../../services/api';
// material
import { Stack, TextField, IconButton, InputAdornment, Snackbar} from '@mui/material';

import { LoadingButton } from '@mui/lab';
// component
import Iconify from '../../../components/Iconify';

export default function LoginForm() {
  const navigate = useNavigate();

  const [erro, setErro] = useState(false);

  const [open, setOpen] = useState(false);
  const [message,setMessage] = useState('');

  useEffect(() => {
    if (erro === true) {
      showAlert('Falha na autenticação, USUÁRIO/SENHA incorreto, verifique!!!');    
      setErro(false);
    }
  }, [erro]);

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

  const [showPassword, setShowPassword] = useState(false);
  const LoginSchema = Yup.object().shape({
    usuario: Yup.string().required('Usuário é obrigatório'),    
    password: Yup.string().required('Password é obrigatório').min(6, 'Mínimo 6 caracteres!'),
  });

  const formik = useFormik({
    initialValues: {
      usuario: '',
      password: '',
      remember: true,
    },
    validationSchema: LoginSchema,
    onSubmit: async (value , { setSubmitting }) => {
      setSubmitting(true);
      await Auth.signIn({
        username: value.usuario,
        password: value.password
      })
        .then(() => {
          setSubmitting(true);
          Auth.currentSession()
            .then(async (userSession) => {
              setSubmitting(true);              
              const token = userSession.idToken.jwtToken;
              localStorage.setItem('squad2UserToken', JSON.stringify(token));
              let decoded = jwt_decode(token);
              let squad2User =  { token, decoded }

              await api().get(`/usuario/${decoded.sub}`)
              .then((response) => {
                setSubmitting(true);
                squad2User.user = response.data.result;
                localStorage.setItem('squad2User', JSON.stringify(squad2User));
                navigate('/dashboard', { replace: true });
              })
              .catch((error) => {
                console.log(error.message, erro);
                setSubmitting(false);
                handleErro();
                navigate('/login', { replace: true });       
              });                          
            })
            .catch((err) => {
              setSubmitting(false);
              handleErro();
              console.log(err);
              navigate('/login', { replace: true });
            });
        })
        .catch((err) => {
          setSubmitting(false);
          handleErro();
          navigate('/login', { replace: true });
        });
    },
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleErro = () => {
    setErro(true);    
  };

  return (
      <>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                autoComplete="username"
                type="usuario"
                label="Usuário"
                {...getFieldProps('usuario')}
                error={Boolean(touched.usuario && errors.usuario)}
                helperText={touched.usuario && errors.usuario}
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
                      <IconButton onClick={handleShowPassword} edge="end">
                        <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={Boolean(touched.password && errors.password)}
                helperText={touched.password && errors.password}
              />
            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
            </Stack>

            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
              Login
            </LoadingButton>
    
          </Form>
        </FormikProvider>
        <Stack spacing={2} sx={{ width: '100%' }}>
          <Snackbar 
            open={open} 
            autoHideDuration={5000} 
            onClose={handleCloseAlert} 
            message={message}
            >
          </Snackbar>
        </Stack>           
      </>
  );  
}
