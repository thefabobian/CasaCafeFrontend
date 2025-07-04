import { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { loginRequest } from './api';
import { decodeJwt } from '../../utils/jwtHelper';

import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Paper,
  InputAdornment,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

interface JwtPayload {
  role: string;
  sub: string;
}

const MotionButton = motion(Button);

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Para responsividad
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userData = await loginRequest({ email, password });
      const decoded: JwtPayload = decodeJwt<JwtPayload>(userData.accessToken);
      const roleFromToken = decoded.role;
      const roles = roleFromToken === 'ROLE_ADMIN' ? ['ADMIN'] : ['CUSTOMER'];

      login({
        username: userData.username,
        roles,
        token: userData.accessToken,
      });

      navigate(roles.includes('ADMIN') ? '/admin' : '/home');
    } catch (error) {
      toast.error('Credenciales inválidas');
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage:
          'linear-gradient(135deg, rgba(226,68,68,0.8) 0%, #8b2b07 100%)',
        p: isSmallScreen ? 2 : 3,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Imagen en esquina superior izquierda */}
      <Box
        component="img"
        src="/images/casa.png"
        alt="Casa Café Logo"
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          width: isSmallScreen ? 130 : 160, // Aumentado tamaño aquí
          opacity: 1,
          userSelect: 'none',
          pointerEvents: 'none',
          zIndex: 0,
        }}
        draggable={false}
      />

      <Paper
        elevation={10}
        sx={{
          p: isSmallScreen ? 3 : 5,
          maxWidth: isSmallScreen ? 320 : 420,
          width: '100%',
          borderRadius: 3,
          boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Typography
          variant={isSmallScreen ? 'h5' : 'h4'}
          component="h1"
          textAlign="center"
          fontWeight="700"
          color="primary.main"
          gutterBottom
          sx={{ letterSpacing: 2 }}
        >
          Bienvenido
        </Typography>
        <Typography
          variant="subtitle1"
          textAlign="center"
          color="text.secondary"
          mb={2}
          sx={{ fontSize: isSmallScreen ? '0.9rem' : '1rem' }}
        >
          Por favor, inicia sesión para continuar
        </Typography>

        <form onSubmit={handleLogin} noValidate>
          <TextField
            label="Correo electrónico"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            margin="normal"
            autoComplete="email"
          />
          <TextField
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            margin="normal"
            autoComplete="current-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                    }
                    onClick={toggleShowPassword}
                    edge="end"
                    size="large"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <MotionButton
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            sx={{ mt: 3, fontWeight: 'bold', letterSpacing: 1 }}
            whileHover={{ scale: 1.05 }}
          >
            Ingresar
          </MotionButton>
        </form>

        <Typography variant="body2" textAlign="center" mt={2}>
          ¿No tienes una cuenta?{' '}
          <Link
            component={RouterLink}
            to="/create-account"
            underline="hover"
            color="primary"
          >
            Regístrate aquí
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};
