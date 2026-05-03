import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Customers from "./pages/Customers";
import Trainings from "./pages/Trainings";
import "./App.css";
function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Customers</Link>
        <Link to="/trainings">Trainings</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Customers />} />
        <Route path="/trainings" element={<Trainings />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
