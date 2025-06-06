import { useState } from 'react';
import { Routes, Route } from 'react-router';
import { getUser } from '../../services/authService';
import HomePage from '../HomePage/HomePage';
import HootListPage from '../HootListPage/HootListPage';
import HootDetailsPage from '../HootDetailsPage/HootDetailsPage';
import HootNewPage from '../HootNewPage/HootNewPage';
import HootEditPage from '../HootEditPage/HootEditPage';
import SignUpPage from '../SignUpPage/SignUpPage';
import LogInPage from '../LogInPage/LogInPage';
import NavBar from '../../components/NavBar/NavBar';
import './App.css';

export default function App() {
  const [user, setUser] = useState(getUser());

  return (
    <main className="App">
      <NavBar user={user} setUser={setUser} />
      <section id="main-section">
        <Routes>
          <Route path="/" element={<HomePage />} />
          {user ? (
            <>
              <Route path="/hoots" element={<HootListPage user={user} />} />
              <Route path="/hoots/new" element={<HootNewPage user={user} />} />
              <Route path="/hoots/:hootId" element={<HootDetailsPage user={user} />} />
              <Route path="/hoots/:hootId/edit" element={<HootEditPage user={user} />} />
              <Route path="*" element={null} />
            </>
          ) : (
            <>
              <Route path="/signup" element={<SignUpPage setUser={setUser} />} />
              <Route path="/login" element={<LogInPage setUser={setUser} />} />
              <Route path="*" element={null} />
            </>
          )}
        </Routes>
      </section>
    </main>
  );
}

