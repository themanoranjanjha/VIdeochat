import {BrowserRouter as Router ,Routes, Route } from "react-router-dom";
import "./App.css";
import LobbyScreen from "./screens/Lobby";
import RoomPage from "./screens/Room";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import {AuthProvider } from "./context/AuthContext"
import PrivateRoutes from "./components/PrivateRoutes";

function App() {
  return (
    <div className="App">

      <Router>
       <AuthProvider>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />}/>
        <Route element={<PrivateRoutes/>}>
        <Route path="/lobby" element={<LobbyScreen />} />
        <Route path="/room/:roomId" element={<RoomPage />} />
        </Route>
      </Routes>
      </AuthProvider>
      </Router>
    </div>
  );
}

export default App;

