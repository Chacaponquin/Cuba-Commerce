import { useState } from "react";
import { BsGear } from "react-icons/bs";
import { FaSearch, FaPlus, FaUser, FaDoorClosed } from "react-icons/fa";
import { useNavigate } from "react-router";
import { auth } from "../../firebase/client";
import "./navBar.css";

interface ProfilePicture {
  profile: any;
}

const NavBar = (): JSX.Element => {
  return (
    <div className="navBar">
      <a href="/">
        <img src="./commerce-logo.png" alt="cuba-commerce-logo" />
      </a>

      <div>
        {auth.currentUser && (
          <a href="/search" className="search-icon">
            <FaSearch size={30} />
          </a>
        )}

        {auth.currentUser ? (
          <>
            <a href="/addProduct" className="add-product">
              <FaPlus size={20} color="white" />
            </a>

            <ProfilePhoto profile={auth.currentUser} />
          </>
        ) : (
          <section>
            <a href="/signIn">SignIn</a>
            <a href="/signUp">SignUp</a>
          </section>
        )}
      </div>
    </div>
  );
};

const ProfilePhoto = ({ profile }: ProfilePicture): JSX.Element => {
  const picture = profile.photoURL;

  const [optionsOpen, setOptionsOpen] = useState<boolean>(false);

  return (
    <div className="profilePhoto">
      {picture ? (
        <section>
          <img
            src={picture}
            alt={profile.displayName}
            onClick={() => setOptionsOpen(!optionsOpen)}
          />

          {optionsOpen && <ProfileNavBar />}
        </section>
      ) : (
        <section>
          <div
            className="no-picture"
            onClick={() => setOptionsOpen(!optionsOpen)}
          >
            <FaUser color="white" size={25} />
          </div>

          {optionsOpen && <ProfileNavBar />}
        </section>
      )}
    </div>
  );
};

const ProfileNavBar = (): JSX.Element => {
  const navigate = useNavigate();
  return (
    <div className="profile-photo-options">
      <a href={`/myProfile/${auth.currentUser?.uid}`} className="photo-option">
        <p>Edit Profile</p>
        <BsGear size={20} />
      </a>

      <a
        href={`/`}
        className="photo-option"
        onClick={() => {
          auth.signOut().then(() => navigate("/"));
        }}
      >
        <p>Sign Out</p>
        <FaDoorClosed size={20} />
      </a>
    </div>
  );
};

export default NavBar;
