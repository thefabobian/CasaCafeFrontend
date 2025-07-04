import { Box, Typography, Paper } from "@mui/material";
import { motion } from "framer-motion";

export const AdminPage = () => {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      sx={{
        minHeight: "100vh",
        backgroundImage:
          "linear-gradient(135deg, rgba(58,66,86,0.9), rgba(30,32,44,1))",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
        position: "relative",
      }}
    >
      <Paper
        elevation={12}
        sx={{
          p: 5,
          borderRadius: 4,
          width: "100%",
          maxWidth: 600,
          backgroundColor: "rgba(255,255,255,0.95)",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          color="primary"
          sx={{ fontFamily: "serif", letterSpacing: 1 }}
        >
          👨‍💼 Hola, Admin
        </Typography>

        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Esta es tu interfaz de administración
        </Typography>

        {/* Animación de "Muy pronto..." */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 1.5,
            ease: "easeInOut",
          }}
          style={{ marginTop: "2rem" }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{
              fontFamily: "monospace",
              fontSize: "1.2rem",
              color: "#3e2723", // Color marrón oscuro
              textShadow: "0 2px 5px rgba(0,0,0,0.25)",
            }}
          >
            🚧 Muy pronto...
          </Typography>
        </motion.div>
      </Paper>
    </Box>
  );
};
