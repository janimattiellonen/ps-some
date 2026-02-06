import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import PlayerPage from "./pages/PlayerPage";
import ScoresPage from "./pages/ScoresPage";
import ScoresPage2 from "./pages/ScoresPage2";
import EventPage from "./pages/EventPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/player" element={<PlayerPage />} />
        <Route path="/scores" element={<ScoresPage />} />
        <Route path="/scores2" element={<ScoresPage2 />} />
        <Route path="/event" element={<EventPage />} />
      </Routes>
    </BrowserRouter>
  );
}
