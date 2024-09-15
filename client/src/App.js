import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";  // Import Routes
import Join from './components/Join/Join';
import Chat from './components/Chat/Chat';

function App() {
  return (
    <Router>
      <Routes>  {/* Use Routes to wrap Route components */}
        <Route path="/" element={<Join />} />  {/* Use element prop for component */}
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;
