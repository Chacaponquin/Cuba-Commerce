import { useContext } from "react";
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
import { ColorContext, colors } from "./context/ColorContext";

const App = () => {
  //EXTRAER EL CONTEXTO
  const context = useContext(ColorContext);

  return (
    <main className={context?.colorMode === colors.LIGHT ? "light" : "dark"}>
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
          <Route path="/profile/:id" element={<Profile />} />
        </Routes>
      </Router>
    </main>
  );
};

export default App;
