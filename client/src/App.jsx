import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<h1>FarmersBook</h1>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<h1>Register</h1>} />
          <Route path="/dashboard" element={<h1>Dashboard</h1>} />
          <Route path="/lands" element={<h1>Lands</h1>} />
          <Route path="/profile" element={<h1>Profile</h1>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;