import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './modules/auth/AuthContext';
import { LoginPage } from './modules/auth/LoginPage';
import { AdminPage } from './modules/admin/AdminPage';
import { ProductsCustomer } from './modules/products/productsCustomer/ProductsCustomer';
import CustomerPage from './modules/customer/CustomerPage';
import { CheckoutPage } from './modules/checkout/CheckoutPage';


function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path='/create-account' element={<CustomerPage />} />
      {/* Rutas protegidas */}
      <Route path="/admin" element={ user && user.roles?.includes('ADMIN') ? (<AdminPage />) : (<Navigate to="/" replace />)}/>
      <Route path="/home" element={ user && user.roles?.includes('CUSTOMER') ? (<ProductsCustomer />) : ( <Navigate to="/" replace />)}/>
      <Route path="/checkout" element={user && user.roles?.includes('CUSTOMER') ? (<CheckoutPage />) : (<Navigate to="/" replace />)}/>
    </Routes>
  );
}

export default App;
