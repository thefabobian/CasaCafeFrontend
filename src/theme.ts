import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#8b2b07',       // Marrón oscuro botón principal
      contrastText: '#fafafa',
    },
    secondary: {
      main: '#bdbdbd',
      contrastText: '#000000', // Color texto secundario negro
    },
    text: {
      primary: '#000000',       // Color principal texto negro
      secondary: '#000000',     // También negro para textos secundarios
      // Puedes agregar link si quieres, pero no hay default, se suele definir en componentes
    },
    background: {
      default: '#fafafa',
      paper: 'rgba(226, 68, 68, 0.6)',
    },
    error: {
      main: '#1dbbbb',
    },
    success: {
      main: 'rgb(19,197,19)',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    // Si quieres, puedes agregar estilos para links aquí con variantes personalizadas
  },
});

export default theme;
