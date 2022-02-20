import { useState } from "react";
import { BsGear, BsMailbox, BsX } from "react-icons/bs";
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
        <img src="./images/NavBar-logo.png" alt="cuba-commerce-logo" />
      </a>

      <div>
        <MailNotifications />

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
            <a href="/signIn">Sign In</a>
            <a href="/signUp">Sign Up</a>
          </section>
        )}
      </div>
    </div>
  );
};

const ProfilePhoto = ({ profile }: ProfilePicture): JSX.Element => {
  //EXTRAER LA FOTO DEL OBJETO USUARIO
  const picture = profile.photoURL;
  //STATE PARA VER SI ESTAN ABIERTAS LAS OPCIONES
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

          {optionsOpen && <ProfileOptions />}
        </section>
      ) : (
        <section>
          <div
            className="no-picture"
            onClick={() => setOptionsOpen(!optionsOpen)}
          >
            <FaUser color="white" size={25} />
          </div>

          {optionsOpen && <ProfileOptions />}
        </section>
      )}
    </div>
  );
};

const ProfileOptions = (): JSX.Element => {
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

const MailNotifications = (): JSX.Element => {
  //STATE QUE INDICA SI ESTAN ABIERTAS LAS NOTIFICACIONES
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);

  //FUNCION PARA ELIMINAR UNA NOTIFICACION
  const hanldeDeleteNotification = () => {
    console.log(auth.currentUser?.uid);
  };

  return (
    <section
      className={`navBar-mail-notifications ${
        notificationsOpen ? "notification-open" : "notification-close"
      }`}
    >
      <BsMailbox
        size={40}
        onClick={() => setNotificationsOpen(!notificationsOpen)}
      />

      {notificationsOpen && (
        <div className="mail-notifications">
          <div>
            <p>A Patricio le interesa el producto Audifonos</p>
            <BsX size={25} onClick={hanldeDeleteNotification} />
          </div>
        </div>
      )}
    </section>
  );
};

export default NavBar;
