import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { ProductDto, CartDto } from "../types";
import {
  getAllProducts,
  getCartByCustomerUuid,
  getAllCustomers,
} from "../api";
import { decodeJwt } from "../../../utils/jwtHelper";
import {
  addOrUpdateItemCart,
  deleteItemCart,
  updateItemCartQuantity,
} from "../../itemCart/api";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
} from "@mui/material";

import { styled } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    borderBottom: 0,
  },
}));

const GradientButton = styled(Button)(() => ({
  background: "linear-gradient(45deg, #A0522D 30%, #D2691E 90%)",
  color: "#fff",
  fontWeight: "bold",
  transition: "background 0.3s ease",
  "&:hover": {
    background: "linear-gradient(45deg, #D2691E 30%, #A0522D 90%)",
  },
}));

export const ProductsCustomer = () => {
  const { user, logout } = useAuth();
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [, setCerrando] = useState(false);
  const [cart, setCart] = useState<CartDto | null>(null);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const data = await getAllProducts(page, 9, searchTerm);
        setProducts(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error al obtener productos", error);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, [page, searchTerm]);

  useEffect(() => {
    const obtenerCarrito = async () => {
      if (!user?.token || !user.roles.includes("CUSTOMER")) return;
      try {
        const decoded = decodeJwt<{ role: string; sub: string }>(user.token);
        const emailJwt = decoded.sub;
        const response = await getAllCustomers();
        const customers = response.content;
        const cliente = customers.find(
          (c) => c.email?.toLowerCase() === emailJwt.toLowerCase()
        );
        if (cliente) {
          const cartData = await getCartByCustomerUuid(cliente.uuid);
          setCart({
            ...cartData,
            items: Array.isArray(cartData.items) ? cartData.items : [],
          });
        } else {
          setCart(null);
        }
      } catch (err) {
        console.error("Error al obtener carrito:", err);
        setCart(null);
      }
    };
    obtenerCarrito();
  }, [user]);

  const cerrarCarrito = () => {
    setCerrando(true);
    setTimeout(() => {
      setCarritoAbierto(false);
      setCerrando(false);
    }, 300);
  };

  const agregarProducto = async (product: ProductDto) => {
    if (!cart) {
      setOpenSnackbar({ open: true, message: "Carrito no cargado", severity: "error" });
      return;
    }
    if (loadingAdd) return;
    setLoadingAdd(true);

    try {
      await addOrUpdateItemCart({
        cartId: cart.id,
        productId: product.id,
        quantity: 1,
      });
      const updatedCart = await getCartByCustomerUuid(cart.customerUuid);
      setCart({
        ...updatedCart,
        items: Array.isArray(updatedCart.items) ? updatedCart.items : [],
      });
      setOpenSnackbar({ open: true, message: "Producto agregado al carrito", severity: "success" });
    } catch (error) {
      console.error("Error agregando producto al carrito", error);
      setOpenSnackbar({ open: true, message: "Error agregando producto", severity: "error" });
    } finally {
      setLoadingAdd(false);
    }
  };

  const actualizarCantidad = async (itemId: number, cantidad: number) => {
    if (cantidad < 1) return;
    if (!cart) return;
    const item = cart.items.find((i) => i.id === itemId);
    if (!item) {
      setOpenSnackbar({ open: true, message: "Item no encontrado en el carrito", severity: "error" });
      return;
    }
    try {
      await updateItemCartQuantity(itemId, {
        cartId: cart.id,
        productId: item.product.id,
        quantity: cantidad,
      });
      const updateCart = await getCartByCustomerUuid(cart.customerUuid);
      setCart({
        ...updateCart,
        items: Array.isArray(updateCart.items) ? updateCart.items : [],
      });
    } catch (error) {
      console.error("Error actualizando cantidad ", error);
      setOpenSnackbar({ open: true, message: "Error actualizando cantidad", severity: "error" });
    }
  };

  const eliminarProducto = async (itemId: number) => {
    try {
      await deleteItemCart(itemId);
      if (!cart) return;
      const updateCart = await getCartByCustomerUuid(cart.customerUuid);
      setCart({
        ...updateCart,
        items: Array.isArray(updateCart.items) ? updateCart.items : [],
      });
      setOpenSnackbar({ open: true, message: "Producto eliminado", severity: "info" });
    } catch (error) {
      console.error("Error eliminando producto ", error);
      setOpenSnackbar({ open: true, message: "Error eliminando producto", severity: "error" });
    }
  };

  // Estado y control para Snackbar (alertas)
  const [openSnackbar, setOpenSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "error" | "success" | "info";
  }>({ open: false, message: "", severity: "info" });

  const handleCloseSnackbar = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setOpenSnackbar({ ...openSnackbar, open: false });
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      {/* Contenedor padre con fondo */}
        <Box
          sx={{
            height: "100vh",
            overflow: "hidden",
            backgroundImage: "url('/images/logo final.jpeg')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
            backgroundSize: "cover",
            backgroundAttachment: "fixed",
            display: "flex",
            justifyContent: "center",
            padding: 4,
          }}
        >
        {/* Contenedor blanco para contenido */}
        <motion.div
          animate={{ x: carritoAbierto ? -160 : 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          style={{
            height: "100vh",
            maxWidth: isMobile ? "100%" : 1100,
            margin: isMobile ? "0" : "auto",
            backgroundColor: "#FFF4E5",
            borderRadius: isMobile ? 0 : 12,
            boxShadow: isMobile ? "none" : "0 8px 24px rgba(0,0,0,0.15)",
            display: "flex",
            flexDirection: "column",
            padding: 24,
            overflowX: "hidden",
            position: "relative",
            zIndex: 1,
            width: "100%",
          }}
        >
          {/* Contenido interior fijo */}
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 3,
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Typography variant="h5" sx={{ flex: "1 1 auto" }}>
                Bienvenido, {user?.username || "Invitado"}
              </Typography>
              {user && (
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#4B342F",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#3E2E28",
                    },
                    flexShrink: 0,
                  }}
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </Button>
              )}
            </Box>

            <TextField
              label="Buscar por nombre"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(0);
              }}
              fullWidth
              sx={{
                mb: 3,
                backgroundColor: "#fff",
                borderRadius: 1,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#A0522D",
                  },
                  "&:hover fieldset": {
                    borderColor: "#6D4C41",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#6D4C41",
                    boxShadow: "0 0 0 2px rgba(109, 76, 65, 0.3)",
                  },
                },
              }}
            />

            {loadingProducts ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  p: 4,
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer
                component={Paper}
                elevation={4}
                sx={{
                  borderRadius: 2,
                  backgroundColor: "#fff",
                  overflowX: "auto",
                }}
              >
                <Table stickyHeader aria-label="Productos">
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          backgroundColor: "#6D4C41",
                          color: "white",
                          fontWeight: "bold",
                          position: "sticky",
                          top: 0,
                          zIndex: 10,
                        }}
                      >
                        Imagen
                      </TableCell>
                      <TableCell
                        sx={{
                          backgroundColor: "#6D4C41",
                          color: "white",
                          fontWeight: "bold",
                          position: "sticky",
                          top: 0,
                          zIndex: 10,
                        }}
                      >
                        Nombre
                      </TableCell>
                      <TableCell
                        sx={{
                          backgroundColor: "#6D4C41",
                          color: "white",
                          fontWeight: "bold",
                          position: "sticky",
                          top: 0,
                          zIndex: 10,
                        }}
                      >
                        Descripción
                      </TableCell>
                      <TableCell
                        sx={{
                          backgroundColor: "#6D4C41",
                          color: "white",
                          fontWeight: "bold",
                          position: "sticky",
                          top: 0,
                          zIndex: 10,
                        }}
                      >
                        Precio
                      </TableCell>
                      <TableCell
                        sx={{
                          backgroundColor: "#6D4C41",
                          color: "white",
                          fontWeight: "bold",
                          position: "sticky",
                          top: 0,
                          zIndex: 10,
                        }}
                      >
                        Stock
                      </TableCell>
                      <TableCell
                        sx={{
                          backgroundColor: "#6D4C41",
                          color: "white",
                          fontWeight: "bold",
                          position: "sticky",
                          top: 0,
                          zIndex: 10,
                        }}
                        align="center"
                      >
                        Acción
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.map((prod) => (
                      <StyledTableRow key={prod.id}>
                        <TableCell>
                          <img
                            src={prod.imageUrl}
                            alt={prod.name}
                            width={80}
                            style={{ borderRadius: 8, objectFit: "cover" }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontWeight: "600", color: "#5D4037" }}>
                          {prod.name}
                        </TableCell>
                        <TableCell sx={{ color: "#6D4C41" }}>
                          {prod.description}
                        </TableCell>
                        <TableCell sx={{ fontWeight: "700", color: "#BF360C" }}>
                          ${prod.price.toFixed(2)}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "600",
                            color: "black",
                          }}
                        >
                          {prod.stock}
                        </TableCell>
                        <TableCell align="center">
                          <GradientButton
                            disabled={prod.stock === 0 || loadingAdd}
                            onClick={() => agregarProducto(prod)}
                            startIcon={<ShoppingCartIcon />}
                          >
                            Agregar
                          </GradientButton>
                        </TableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 2,
                mt: 3,
                mb: 4,
                flexWrap: "wrap",
              }}
            >
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#6D4C41",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#5D4037",
                  },
                  minWidth: 100,
                }}
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                Anterior
              </Button>
              <Typography
                variant="body1"
                sx={{ display: "flex", alignItems: "center" }}
              >
                Página {page + 1} de {totalPages}
              </Typography>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#6D4C41",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#5D4037",
                  },
                  minWidth: 100,
                }}
                disabled={page + 1 === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Siguiente
              </Button>
            </Box>
          </Box>
        </motion.div>

        {!carritoAbierto && (
          <IconButton
            color="primary"
            onClick={() => setCarritoAbierto(true)}
            sx={{
              position: "fixed",
              bottom: 24,
              right: 24,
              bgcolor: "primary.main",
              "&:hover": { bgcolor: "primary.dark" },
              boxShadow: 3,
              color: "white",
              zIndex: 1300,
            }}
            aria-label="Ver carrito"
          >
            <ShoppingCartIcon fontSize="large" />
          </IconButton>
        )}

        <AnimatePresence>
          {carritoAbierto && cart && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{
                position: "fixed",
                top: 0,
                right: 0,
                width: 350,
                height: "100vh",
                background: "#FFF3E0",
                boxShadow: "0 0 12px rgba(0,0,0,0.25)",
                zIndex: 1400,
                display: "flex",
                flexDirection: "column",
                padding: 24,
                overflowY: "auto",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6">Carrito de compras</Typography>
                <IconButton onClick={cerrarCarrito} aria-label="Cerrar carrito">
                  <CloseIcon />
                </IconButton>
              </Box>

              <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
                {cart.items.length > 0 ? (
                  cart.items.map((item) => (
                    <Box
                      key={item.id}
                      sx={{
                        borderBottom: "1px solid #ddd",
                        py: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                      }}
                    >
                      <Typography variant="subtitle1">
                        {item.product?.name ?? "Producto no disponible"}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          alignItems: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() =>
                            actualizarCantidad(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          <RemoveIcon />
                        </Button>
                        <Typography>{item.quantity}</Typography>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() =>
                            actualizarCantidad(item.id, item.quantity + 1)
                          }
                        >
                          <AddIcon />
                        </Button>
                        <Typography sx={{ ml: "auto", fontWeight: "bold" }}>
                          $
                          {(item.quantity * (item.product?.price ?? 0)).toFixed(
                            2
                          )}
                        </Typography>
                      </Box>
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => eliminarProducto(item.id)}
                        sx={{
                          alignSelf: "flex-end",
                          color: "#4B342F",
                          fontWeight: "bold",
                          "&:hover": {
                            color: "#3E2E28",
                            backgroundColor: "transparent",
                            textDecoration: "underline",
                            cursor: "pointer",
                          },
                        }}
                      >
                        Eliminar
                      </Button>
                    </Box>
                  ))
                ) : (
                  <Typography>No hay productos seleccionados.</Typography>
                )}
              </Box>

              <Box
                sx={{
                  borderTop: "1px solid #ddd",
                  mt: 2,
                  pt: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6">
                  Total: $
                  {cart.items
                    .reduce(
                      (acc, item) => acc + (item.product?.price ?? 0) * item.quantity,
                      0
                    )
                    .toFixed(2)}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate("/checkout")}
                >
                  Finalizar compra
                </Button>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Snackbar para alertas y mensajes */}
        <Snackbar
          open={openSnackbar.open}
          autoHideDuration={2000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={openSnackbar.severity}
            sx={{ width: "100%" }}
            variant="filled"
          >
            {openSnackbar.message}
          </Alert>
        </Snackbar>
        </Box>
    </>
    );
};
