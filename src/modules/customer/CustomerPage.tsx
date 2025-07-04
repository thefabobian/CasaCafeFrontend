import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CustomerPayload } from "./types";
import { crearCliente } from "./api";

import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import { motion } from "framer-motion";

const MotionPaper = motion(Paper);

const initialState: CustomerPayload = {
  username: "",
  email: "",
  password: "",
  dni: "",
  phone: "",
  address: "",
  birth: "",
};

const CustomerPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CustomerPayload>(initialState);
  const [openSnackbar, setOpenSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCloseSnackbar = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setOpenSnackbar({ ...openSnackbar, open: false });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await crearCliente(formData);
      setOpenSnackbar({ open: true, message: "Cliente creado exitosamente", severity: "success" });
      setFormData(initialState);
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      console.error("Error al crear cliente: ", error);
      setOpenSnackbar({ open: true, message: "Error al crear cliente", severity: "error" });
    }
  };

  const handleCancel = () => {
    setFormData(initialState);
    navigate("/");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: 'url("/images/logo final.jpeg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <MotionPaper
        elevation={12}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        sx={{
          p: isSmallScreen ? 3 : 6,
          maxWidth: 480,
          width: "100%",
          borderRadius: 4,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
        }}
      >
        <Typography
          variant={isSmallScreen ? "h5" : "h4"}
          component="h1"
          textAlign="center"
          fontWeight="700"
          color="primary.main"
          gutterBottom
        >
          Registro de Usuario
        </Typography>

        <form onSubmit={handleSubmit} noValidate>
          <TextField
            label="Nombre de usuario"
            name="username"
            value={formData.username}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Correo electrónico"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Contraseña"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Documento de identidad"
            name="dni"
            value={formData.dni}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Teléfono"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Dirección"
            name="address"
            value={formData.address}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Fecha de nacimiento"
            name="birth"
            type="date"
            value={formData.birth}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 3,
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth={isSmallScreen}
              sx={{ fontWeight: "bold" }}
            >
              Enviar
            </Button>
            <Button
              type="button"
              variant="contained"
              color="secondary"
              fullWidth={isSmallScreen}
              sx={{
                fontWeight: "bold",
                backgroundColor: "#6D4C41",
                color: "#F5F5F5",
                "&:hover": {
                  backgroundColor: "#5D3A1A",
                },
              }}
              onClick={handleCancel}
            >
              Cancelar
            </Button>
          </Box>
        </form>
      </MotionPaper>

      <Snackbar
        open={openSnackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={openSnackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {openSnackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CustomerPage;
