import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/Home/Home';
import Signup from './pages/Signup/Signup';
import Login from './pages/Login/Login';

const routes = (
  <Router>
    <Routes>
      <Route path="/dashboard"  element = {<Home />} />
      <Route path="/login"  element = {<Login />} />
      <Route path="/signup"  element = {<Signup />} />
    </Routes>
  </Router>
);

const App = () => {
  return (
    <div>{routes}</div>
  )
};

export default App;