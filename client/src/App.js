// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import ProductList from './pages/ProductList';
import Login from './pages/Login';
import Logout from './pages/Logout';
import ProtectedRoute from './components/ProtectedRoute';
import Checkout from './pages/Checkout';
import Cart from './pages/Cart';
import Payment from './pages/Payment'; 
import AddCategory from './pages/AddCategory'; 
import AddProduct from './pages/AddProduct'; 
import DeletedLogs from './pages/DeletedLogs';
import AdminBannerUpload from './pages/AdminBannerUpload';
import ReviewApprovalPage from './pages/ReviewApprovalPage';
import { Navigate } from 'react-router-dom';

// ✅ AdminOnlyRoute: only allow ID === 1
function AdminOnlyRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log('User:', user);
  return user && user.UserId === 1 ? children : <Navigate to="/" />;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ Public Route */}
        <Route path="/" element={<Login />} />

        {/* ✅ Admin Protected Routes under /admin */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminOnlyRoute>
                <DashboardLayout />
              </AdminOnlyRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<ProductList />} />
          <Route path="reports" element={<Reports />} />
          <Route path="logout" element={<Logout />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="payment" element={<Payment />} />
          <Route path="AddCategory" element={<AddCategory />} />
          <Route path="AddProduct" element={<AddProduct />} />
          <Route path="DeletedLogs" element={<DeletedLogs />} />
          <Route path="AdminBannerUpload" element={<AdminBannerUpload />} />
          <Route path="ReviewApprovalPage" element={<ReviewApprovalPage />} />
        </Route>

        {/* Optional: Catch-all for unknown routes */}
        {/* <Route path="*" element={<Navigate to="/" />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
