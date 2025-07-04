import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { getAllCustomers } from "../products/api";
import { generarFactura } from "./api";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
  Paper,
  Stack,
} from "@mui/material";

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handlePagoEfectivo = async () => {
    if (!user) {
      toast.warn("Debe iniciar sesión");
      return;
    }

    try {
      toast.info("Generando factura...");
      const customersResponse = await getAllCustomers();
      const customers = customersResponse.content;
      const emailJwt = user.username;

      const cliente = customers.find(
        (c) => c.email?.toLowerCase() === emailJwt.toLowerCase()
      );

      if (!cliente) {
        toast.error("Cliente no encontrado");
        return;
      }

      const pdfBlob = await generarFactura({ customerUuid: cliente.uuid });

      const url = window.URL.createObjectURL(
        new Blob([pdfBlob], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `factura_${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      navigate("/");
    } catch (error) {
      toast.error("Error al generar factura, seleccione un producto primero");
    }
  };

  const handlePagoQR = () => {
    toast.info("Pago con QR disponible próximamente ☕");
  };

  const handleCancel = () => {
    navigate("/home");
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      sx={{
        minHeight: "100vh",
        backgroundImage:
          "linear-gradient(135deg, rgba(226,68,68,0.8) 0%, #8b2b07 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
        position: "relative",
      }}
    >
      {/* Logo */}
      <Box
        component="img"
        src="/images/casa.png"
        alt="Logo"
        sx={{
          position: "absolute",
          top: 20,
          left: 20,
          width: isSmallScreen ? 90 : 120,
          opacity: 0.85,
          zIndex: 0,
        }}
      />

      <Paper
        elevation={10}
        sx={{
          p: isSmallScreen ? 3 : 5,
          width: "100%",
          maxWidth: 420,
          borderRadius: 4,
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          textAlign: "center",
          zIndex: 1,
        }}
      >
        <Typography
          variant={isSmallScreen ? "h5" : "h4"}
          fontWeight="bold"
          gutterBottom
          color="primary"
          sx={{ fontFamily: "serif", letterSpacing: 1 }}
        >
          Pagar Factura ☕
        </Typography>

        <Typography variant="subtitle1" color="text.secondary" mb={3}>
          Elige una forma de pago para disfrutar tu café sin preocupaciones
        </Typography>

        <Stack spacing={2}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                fontWeight: "bold",
                backgroundColor: "#6d4c41", // color marrón
                "&:hover": {
                  backgroundColor: "#5d4037",
                },
                color: "white",
                borderRadius: 2,
              }}
              size="large"
              onClick={handlePagoEfectivo}
            >
              💵 Pagar en efectivo
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Button
              variant="outlined"
              fullWidth
              color="secondary"
              onClick={handlePagoQR}
              size="large"
              sx={{ fontWeight: "bold", borderRadius: 2 }}
            >
              📲 Pagar con QR
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                fontWeight: "bold",
                mt: 2,
                backgroundColor: "#9e9e9e",
                color: "#212121",
                "&:hover": {
                  backgroundColor: "#757575",
                },
                borderRadius: 2,
              }}
              onClick={handleCancel}
            >
              Cancelar
            </Button>
          </motion.div>
        </Stack>
      </Paper>
    </Box>
  );
};