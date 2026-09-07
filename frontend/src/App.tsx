import { Routes, Route } from 'react-router-dom';
import { ResumePage } from './pages/ResumePage';
import { AdminPage } from './pages/AdminPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<ResumePage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
}

export default App;
