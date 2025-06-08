import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MagicCallback from "./pages/magic-callback";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Landing from "./pages/Landing";
import PrivateRoute from "./components/PrivateRoute";
import { AppProvider } from "./context/AppProvider";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Docs from "./pages/Docs/Docs";

function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100); // delay ensures it's after render
      }
    }
  }, [location]);

  return null;
}

function App() {
  return (
    <AppProvider>
      <Router>
        <ScrollToHash />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="/docs" element={<Docs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/magic-callback" element={<MagicCallback />} />
          <Route path="*" element={<Landing />} /> {/* fallback */}
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
