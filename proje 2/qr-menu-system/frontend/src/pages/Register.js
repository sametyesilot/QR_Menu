import React, { useContext, useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
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
const RegisterSchema = Yup.object().shape({
  name: Yup.string()
    .required('Ad Soyad gereklidir'),
  email: Yup.string()
    .email('Geçerli bir e-posta adresi giriniz')
    .required('E-posta adresi gereklidir'),
  password: Yup.string()
    .min(6, 'Şifre en az 6 karakter olmalıdır')
    .required('Şifre gereklidir'),
  restaurantName: Yup.string()
    .required('Restoran adı gereklidir')
});

const Register = () => {
  const { register, error } = useContext(AuthContext);
  const [registerError, setRegisterError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    const success = await register(values);
    if (success) {
      navigate('/');
    } else {
      setRegisterError(error || 'Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.');
    }
    setSubmitting(false);
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Kayıt Ol
          </Typography>
          
          {registerError && (
            <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
              {registerError}
            </Alert>
          )}
          
          <Formik
            initialValues={{ 
              name: '',
              email: '',
              password: '',
              restaurantName: '' 
            }}
            validationSchema={RegisterSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form style={{ width: '100%', marginTop: '1rem' }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      name="name"
                      label="Ad Soyad"
                      variant="outlined"
                      fullWidth
                      error={touched.name && Boolean(errors.name)}
                      helperText={touched.name && errors.name}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      name="email"
                      label="E-posta Adresi"
                      variant="outlined"
                      fullWidth
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      name="password"
                      label="Şifre"
                      type="password"
                      variant="outlined"
                      fullWidth
                      error={touched.password && Boolean(errors.password)}
                      helperText={touched.password && errors.password}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      name="restaurantName"
                      label="Restoran Adı"
                      variant="outlined"
                      fullWidth
                      error={touched.restaurantName && Boolean(errors.restaurantName)}
                      helperText={touched.restaurantName && errors.restaurantName}
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  sx={{ mt: 3, mb: 2 }}
                >
                  {isSubmitting ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}
                </Button>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Link component={RouterLink} to="/login" variant="body2">
                      Zaten hesabınız var mı? Giriş yapın
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

export default Register; 