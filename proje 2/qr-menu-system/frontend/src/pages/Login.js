import React, { useContext, useState } from 'react';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
  Alert,
  Paper
} from '@mui/material';

// Validation schema
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Geçerli bir e-posta adresi giriniz')
    .required('E-posta adresi gereklidir'),
  password: Yup.string()
    .required('Şifre gereklidir')
});

const Login = () => {
  const { login, error, isAuthenticated } = useContext(AuthContext);
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Kullanıcı giriş yapmışsa ve login sayfasına gelirse anasayfaya yönlendir
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Gelinen sayfayı al, yoksa anasayfaya yönlendir
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (values, { setSubmitting }) => {
    const success = await login(values.email, values.password);
    if (success) {
      // Başarılı girişte gelinen sayfaya yönlendir
      navigate(from, { replace: true });
    } else {
      setLoginError(error || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
    }
    setSubmitting(false);
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Giriş Yap
          </Typography>
          
          {loginError && (
            <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
              {loginError}
            </Alert>
          )}
          
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form style={{ width: '100%', marginTop: '1rem' }}>
                <Field
                  as={TextField}
                  name="email"
                  label="E-posta Adresi"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />
                <Field
                  as={TextField}
                  name="password"
                  label="Şifre"
                  type="password"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  sx={{ mt: 3, mb: 2 }}
                >
                  {isSubmitting ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                </Button>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Link component={RouterLink} to="/register" variant="body2">
                      Hesabınız yok mu? Kayıt olun
                    </Link>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login; 