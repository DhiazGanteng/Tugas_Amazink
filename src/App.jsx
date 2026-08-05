import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TicketList from "./pages/TicketList";
import TicketDetail from "./pages/TicketDetail";
import CreateTicket from "./pages/CreateTicket";
import Profile from "./pages/Profile";
import Bantuan from "./pages/Bantuan";
import ProtectedRoute from "./components/ProtectedRoute";
import { ROLES } from "./utils/roles";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tickets" element={<TicketList />} />
          <Route path="/tickets/:id" element={<TicketDetail />} />
          <Route element={<ProtectedRoute roles={[ROLES.USER]} />}>
            <Route path="/create-ticket" element={<CreateTicket />} />
          </Route>
          <Route path="/profile" element={<Profile />} />
          <Route path="/help" element={<Bantuan />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
