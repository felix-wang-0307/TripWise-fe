import ListGroup from "./components/ListGroup";
import Signup from "./components/Signup";
import Resetpw from "./components/Resetpw";
import Modal from "./components/modal";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} /> {/* Signup Page */}
        <Route path="/login" element={<ListGroup />} /> {/* LOGIN Page */}
        <Route path="/resetpw" element={<Resetpw />} />{" "}
        {/* RESET PASSWORD Page */}
        <Route path="/" element={<Modal />} />
        {/* MAIN Page */}
      </Routes>
    </Router>
  );
}

export default App;
