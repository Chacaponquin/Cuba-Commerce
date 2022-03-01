import { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
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
import { ProfileContext } from "./context/ProfileContext";

const App = () => {
  //EXTRAER EL CONTEXTO
  const context = useContext(ColorContext);
  //EXTRAER CONTEXT DE USER
  const { user } = useContext(ProfileContext);

  return (
    <main className={context?.colorMode === colors.LIGHT ? "light" : "dark"}>
      <Router>
        <Routes>
          <Route path="*" element={<Error404 />} />
          <Route path="/" element={<Home />} />
          <Route path="/signIn" element={<SignIn />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route
            path="/addProduct"
            element={user ? <AddProduct /> : <Navigate to="/" />}
          />
          <Route
            path="/myProfile"
            element={user ? <MyProfile /> : <Navigate to="/" />}
          />
          <Route path="/search" element={<Search />} />
          <Route
            path="/product/:productID"
            element={user ? <Product /> : <Navigate to="/" />}
          />
          <Route
            path="/profile/:id"
            element={user ? <Profile /> : <Navigate to="/" />}
          />
        </Routes>
      </Router>
    </main>
  );
};

export default App;
