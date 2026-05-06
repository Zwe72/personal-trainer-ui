import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Customers from "./pages/Customers";
import Trainings from "./pages/Trainings";
import CalendarPage from"./pages/Calendar";
import "./App.css";
import StatsPage from "./pages/StatsPage";
function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Customers</Link>
        <Link to="/trainings">Trainings</Link>
        <Link to="/calendar">Calendar</Link>
        <Link to="/stats">Stats</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Customers />} />
        <Route path="/trainings" element={<Trainings />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/stats" element={<StatsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
