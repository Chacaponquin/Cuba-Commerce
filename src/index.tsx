import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  AddProduct,
  Home,
  MyProfile,
  Search,
  SignIn,
  SignUp,
} from "./containers/index";
import "./global.css";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/addProduct" element={<AddProduct />} />
        <Route path="/myProfile" element={<MyProfile />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
