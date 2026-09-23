import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CharacterSheet from './pages/CharacterSheet.jsx';
import AdminPanel from './pages/AdminPanel.jsx';
import Wiki from './pages/Wiki.jsx';
import TablePage from './pages/TablePage.jsx';
import GmTablePage from './pages/GmTablePage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CharacterSheet />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/wiki" element={<Wiki />} />
        <Route path="/table" element={<TablePage />} />
        <Route path="/gm/:tableId" element={<GmTablePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
