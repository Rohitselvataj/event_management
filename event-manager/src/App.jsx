import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import AdminAuth from "./pages/AdminAuth";
import UserAuth from "./pages/UserAuth";
import CreateEvent from "./pages/CreateEvent";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/admin-auth" element={<AdminAuth />} />
      <Route path="/user-auth" element={<UserAuth />} />
      <Route path="/user" element={<UserAuth />} />
      <Route path="/create-event" element={<CreateEvent />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}

export default App;
