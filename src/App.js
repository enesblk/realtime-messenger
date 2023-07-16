import React from "react";
import {BrowserRouter,Routes, Route} from "react-router-dom";

//Pages
import Login from "./components/Login";
import Register from "./components/Register";
import Messenger from "./components/Messenger";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/messenger/login" element={<Login/>}/>
        <Route path="/messenger/register" element={<Register/>}/>
        <Route path="/" element={ <ProtectedRoute> <Messenger /> </ProtectedRoute> } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
