import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <h1>Authentication App</h1>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/" element={<h2>Welcome! Please log in or register.</h2>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;