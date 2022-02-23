import { doc, getDoc } from "firebase/firestore";
import { useContext, useEffect, useState, Dispatch } from "react";
import { BsGear, BsMailbox, BsX } from "react-icons/bs";
import { FaSearch, FaPlus, FaUser, FaDoorClosed } from "react-icons/fa";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { auth, db } from "../../firebase/client";
import DarkModeToggle from "react-dark-mode-toggle";
import { ColorContext, colors } from "../../context/ColorContext";
import { SendMessageContainer } from "..";
import "./navBar.css";

interface ProfilePicture {
  profile: any;
}

interface MailNotificationsProps {
  notifications: any[];
  handleSendMessage(id: string): any;
  notificationsOpen: boolean;
  setNotificationsOpen: Dispatch<boolean>;
}

const NavBar = (): JSX.Element => {
  //STATE QUE INDICA SI ESTAN ABIERTAS LAS NOTIFICACIONES
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);
  //STATE CON TODAS LAS NOTIFICACIONES DEL USUARIO
  const [notifications, setNotifications] = useState<any[]>([]);
  //STATE PARA INTERACTUAR CON LA ESCRITURA DE MENSAJE
  const [messageOpen, setMessageOpen] = useState<boolean>(false);
  //STATE QUE CONTIENE EL MENSAJE ESCRITO
  const [message, setMessage] = useState<string>("");
  //STATE DE LOADING
  const [loading, setLoading] = useState<boolean>(false);

  const [selectNotf, setSelectNotf] = useState<null | any>(null);

  //USEEFECT PARA OBTENER TODAS LAS NOTIFICACIONES
  useEffect(() => {
    if (auth.currentUser) {
      //CONTRUIR LA QUERY DE EL USUARIO
      const queryNotification = doc(db, "users", auth.currentUser.uid);
      getDoc(queryNotification)
        .then(async (querySnapshot) => {
          //EXTRAER LOS MENSAJES DEL USUARIO
          const messages = querySnapshot.data()?.messages;

          //BUSCAR EL CREADOR DE CADA MENSAJE
          for (let i = 0; i < messages.length; i++) {
            const profile = await getDoc(
              doc(db, "users", messages[i].profileOwner)
            );

            //OBTENER EL NOMBRE Y EL ID DE CADA CREADOR
            messages[i].profileOwner = {
              name: profile.data()?.nickname,
              id: profile.data()?.id,
            };
          }

          //UBICARLOS EN EL STATE
          setNotifications(messages);
        })
        .catch((error) => console.log(error));
    }
  }, []);

  const handleSendMessage = (id: string) => {
    setMessageOpen(true);
    setNotificationsOpen(false);
    setSelectNotf(notifications[0]);
    console.log(notifications.filter((el) => el.profileOwner.id !== id));
  };

  return (
    <>
      {messageOpen && selectNotf && (
        <SendMessageContainer
          handleSendMessage={handleSendMessage}
          setMessageOpen={setMessageOpen}
          setMessage={setMessage}
          loading={loading}
          profile={selectNotf.profileOwner}
        />
      )}
      <div className="navBar">
        <Link to="/">
          <img src="./images/NavBar-logo.png" alt="cuba-commerce-logo" />
        </Link>

        <div>
          {auth.currentUser && (
            <MailNotifications
              notifications={notifications}
              handleSendMessage={handleSendMessage}
              notificationsOpen={notificationsOpen}
              setNotificationsOpen={setNotificationsOpen}
            />
          )}

          {auth.currentUser ? (
            <>
              <Link to="/addProduct" className="add-product">
                <FaPlus size={20} color="white" />
              </Link>

              <ProfilePhoto profile={auth.currentUser} />
            </>
          ) : (
            <section>
              <Link to="/signIn">Sign In</Link>
              <Link to="/signUp">Sign Up</Link>
            </section>
          )}
        </div>
      </div>
    </>
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
  //CONTEXT
  const context = useContext(ColorContext);
  //FUNCION PARA CAMBIAR A DARK O LIGHT MODE
  const handleChangeMode = () => {
    context?.setColorMode(
      context.colorMode === colors.LIGHT ? colors.DARK : colors.LIGHT
    );
  };

  return (
    <div className="profile-photo-options">
      <Link to={`/myProfile/${auth.currentUser?.uid}`} className="photo-option">
        <p>Edit Profile</p>
        <BsGear size={20} />
      </Link>

      <Link to="/search" className="photo-option">
        <p>Search</p>
        <FaSearch size={20} />
      </Link>

      <Link
        to={`/`}
        className="photo-option"
        onClick={() => {
          auth.signOut().then(() => navigate("/"));
        }}
      >
        <p>Sign Out</p>
        <FaDoorClosed size={20} />
      </Link>

      <div className="photo-option">
        <p>Mode</p>
        <DarkModeToggle
          speed={1}
          size={40}
          checked={context?.colorMode === colors.LIGHT ? false : true}
          onChange={handleChangeMode}
        />
      </div>
    </div>
  );
};

const MailNotifications = ({
  notifications,
  handleSendMessage,
  notificationsOpen,
  setNotificationsOpen,
}: MailNotificationsProps): JSX.Element => {
  //FUNCION PARA ELIMINAR UNA NOTIFICACION
  const handleDeleteNotification = () => {
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
          {notifications.map((el, i: number) => (
            <div key={i}>
              <p>{el.messageNotification}</p>

              <section>
                <button
                  onClick={() => {
                    handleSendMessage(el.profileOwner.id);
                  }}
                >
                  Reply
                </button>

                <BsX size={25} onClick={handleDeleteNotification} />
              </section>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default NavBar;
