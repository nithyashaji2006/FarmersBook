import LandDetails from "./pages/LandDetails";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import AddLand from "./pages/AddLand";
import Lands from "./pages/Lands";
import EditLand from "./pages/EditLand";
import Expenses from "./pages/Expenses";
function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<h1>FarmersBook</h1>} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <h1>Dashboard</h1>
              </ProtectedRoute>
            }
          />

          <Route
            path="/lands"
            element={
              <ProtectedRoute>
                <Lands />
              </ProtectedRoute>
            }
          />

          <Route
  path="/lands/add"
  element={
    <ProtectedRoute>
      <AddLand />
    </ProtectedRoute>
  }
/>

<Route
  path="/lands/edit/:id"
  element={
    <ProtectedRoute>
      <EditLand />
    </ProtectedRoute>
  }
/>

<Route
  path="/lands/:id"
  element={
    <ProtectedRoute>
      <LandDetails />
    </ProtectedRoute>
  }
/>

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>

<Route
  path="/expenses"
  element={
    <ProtectedRoute>
      <Expenses />
    </ProtectedRoute>
  }
/>
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;