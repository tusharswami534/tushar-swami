import React from "react";
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
import Auth from "./components/Auth";
import Chat from "./components/Chat";
import PrivateRoute from "./components/PrivateRoute";


function App() {
  return (
    <BrowserRouter>
     <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
