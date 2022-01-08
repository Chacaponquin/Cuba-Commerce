import { FaSearch, FaPlus, FaUser } from "react-icons/fa";
import { auth } from "../../firebase/client";
import "./navBar.css";

interface ProfilePicture {
  profile: any;
}

const NavBar = (): JSX.Element => {
  return (
    <div className="navBar">
      <a href="/">
        <img src={"./commerce-logo.png"} alt="cuba-commerce-logo" />
      </a>

      <div>
        <a href="/search" className="search-icon">
          <FaSearch size={30} />
        </a>

        {auth.currentUser ? (
          <>
            <a href="/addProduct" className="add-product">
              <FaPlus size={20} color="white" />
            </a>

            <PropfilePhoto profile={auth.currentUser} />
          </>
        ) : (
          <div>
            <a href="/signIn">SignIn</a>
            <a href="/signUp">SignUp</a>
          </div>
        )}
      </div>
    </div>
  );
};

const PropfilePhoto = ({ profile }: ProfilePicture): JSX.Element => {
  const picture = profile.photoURL;

  return (
    <div className="profilePhoto">
      {picture ? (
        <img src={picture} alt={profile.displayName} />
      ) : (
        <FaUser color="white" size={25} />
      )}
    </div>
  );
};

export default NavBar;
