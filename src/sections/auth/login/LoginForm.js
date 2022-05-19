import * as Yup from 'yup';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import { Auth } from 'aws-amplify';
// material
import { Link, Stack, Checkbox, TextField, IconButton, InputAdornment, FormControlLabel} from '@mui/material';

import { LoadingButton } from '@mui/lab';
// component
import Iconify from '../../../components/Iconify';

export default function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required('Usuário é obrigatório'),
    password: Yup.string().required('Password is required'),
  });


  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      remember: true,
    },
    validationSchema: LoginSchema,
    onSubmit: (value) => {


      Auth.signIn({
        username: value.email,
        password: value.password
      })
        .then(() => {
          Auth.currentSession()
            .then(userSession => {
              const token = userSession.idToken.jwtToken;
              navigate('/dashboard', { replace: true });
              console.log(token);
            })
            .catch((err) => {
              console.log(err);
              navigate('/', { replace: true });
            });
        })
        .catch((err) => {
          navigate('/', { replace: true });
        });
    },
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label="Usuário"
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
          <FormControlLabel
            control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
            label="Lembrar"
          />

          <Link component={RouterLink} variant="subtitle2" to="#" underline="hover">
            Esqueceu a senha?
          </Link>
        </Stack>

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          Login
        </LoadingButton>

      </Form>
    </FormikProvider>
  );
}
