import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  AddProduct,
  Error404,
  Home,
  MyProfile,
  Product,
  Profile,
  Search,
  SignIn,
  SignUp,
} from "./containers/index";
import "./global.css";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="*" element={<Error404 />} />
        <Route path="/" element={<Home />} />
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/addProduct" element={<AddProduct />} />
        <Route path="/myProfile/:id" element={<MyProfile />} />
        <Route path="/search" element={<Search />} />
        <Route path="/product/:productID" element={<Product />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
