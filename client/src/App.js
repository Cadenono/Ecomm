import React from "react";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import ProductScreen from "./screens/ProductScreen";
import SignupScreen from "./screens/SignupScreen";
import PrivateRoute from "./components/PrivateRoute";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CartScreen from "./screens/CartScreen";
import ShopScreen from "./screens/ShopScreen";
import ShopScreenFilters from "./screens/ShopScreenFilters";
import AdminRoute from "./components/AdminRoute";
import UserScreen from "./screens/UserScreen";
import CustomerDashboard from "./screens/CustomerDashboard";
import OrderScreen from "./screens/OrderScreen";
import ManageProducts from "./screens/ManageProducts";
import StatsScreen from "./screens/StatsScreen";
import UpdateProduct from "./screens/UpdateProduct";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<SignupScreen />} />
        <Route path="/shop" element={<ShopScreen />} />
        <Route path="/shopbyfilters" element={<ShopScreenFilters />} />
        <Route path="/product/:id" element={<ProductScreen />} />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <UserScreen />
            </PrivateRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <CartScreen />
            </PrivateRoute>
          }
        />
        <Route
          path="/user/dashboard"
          element={
            <PrivateRoute>
              <CustomerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <OrderScreen />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/product/update/:id"
          element={
            <AdminRoute>
              <UpdateProduct />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <AdminRoute>
              <ManageProducts />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/stats"
          element={
            <AdminRoute>
              <StatsScreen />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
