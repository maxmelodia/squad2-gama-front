import * as Yup from 'yup';
import { useState } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import { useNavigate } from 'react-router-dom';
import { Auth } from 'aws-amplify';
// material
import { Stack, TextField, IconButton, InputAdornment, Button, Divider, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// component
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

export default function RegisterForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [codigoVerificacao, setCodigoVerificacao] = useState(false);

  async function signUp(username, password, email) {
      try {
          const { user } = await Auth.signUp({
            username,
            password,
            attributes: {
                email,
                name: username,
            }
          });
          setCodigoVerificacao(true);
      } catch (error) {
          console.log('error signing up:', error);
      }
  }

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().min(2, 'Muito curto!').max(20, 'Muito Longo!').required('Usuário obrigatório'),
    email: Yup.string().email('Email deve ser válido').required('Email obrigatório'),
    password: Yup.string().required('Senha obrigatório').min(6, 'Mínimo 6 caracteres!'),
  });

  const formik = useFormik({
    initialValues: {
      firstName: '',
      email: '',
      password: '',
      codigoVerificacao:''
    },
    validationSchema: RegisterSchema,
    onSubmit: (values) => {
      signUp(values.firstName, values.password, values.email);
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
      {
        codigoVerificacao === false &&      
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
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
      }


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
