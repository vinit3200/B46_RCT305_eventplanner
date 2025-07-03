
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { EventsProvider } from './contexts/EventsContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Events from './pages/Events';
import CreateEvent from './pages/CreateEvent';
import EventDetails from './pages/EventDetails';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <EventsProvider>
        <Router>
          <div className="App">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/events" element={<Events />} />
                <Route path="/event/:id" element={<EventDetails />} />
                <Route path="/create-event" element={
                  <ProtectedRoute>
                    <CreateEvent />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
          </div>
        </Router>
      </EventsProvider>
    </AuthProvider>
  );
}

export default App;
