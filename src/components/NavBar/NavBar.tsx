import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { db } from "../../firebase/client";
import { Error, SendMessageContainer } from "..";
import { validateProfileMessage } from "../../helpers/validations";
import { mostrarError, profileErrors } from "../../helpers/errors";
import { MessageData } from "../../helpers/types";
import ProfilePhoto from "./ProfilePhoto";
import MailNotifications from "./MailNotifications";
import { ProfileContext } from "../../context/ProfileContext";
import "./navBar.css";

const NavBar = (): JSX.Element => {
  //EXTRAER CONTEXT
  const { notifications, user } = useContext(ProfileContext);
  //STATE DE EL TAMAÑO DE LA VENTANA
  const [windowSize, setWindowSize] = useState<number>(window.innerWidth);
  //STATE QUE INDICA SI ESTAN ABIERTAS LAS NOTIFICACIONES
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);
  //STATE PARA INTERACTUAR CON LA ESCRITURA DE MENSAJE
  const [messageOpen, setMessageOpen] = useState<boolean>(false);
  //STATE QUE CONTIENE EL MENSAJE ESCRITO
  const [message, setMessage] = useState<string>("");
  //STATE DE LOADING
  const [loading, setLoading] = useState<boolean>(false);
  //STATE CON EL MENSAJE SELECCIONADO A RESPONDER
  const [selectNotf, setSelectNotf] = useState<null | any>(null);
  //STATE DE ERROR
  const [error, setError] = useState<null | string>(null);

  //USEEFECT PARA SEGUN EL TAMAÑO DE LA VENTANA CAMBIAR DE IMAGEN
  useEffect(() => {
    window.addEventListener("resize", () => setWindowSize(window.innerWidth));
  }, []);

  //FUNCION PARA ABRIR EL ESCRITOR DE MENSAJES
  const handleOpenMessage = (id: string) => {
    //ABRIR EL ESCRITOR DE MENSAJES
    setMessageOpen(true);
    //CERRAR LAS NOTIFICACIONES
    setNotificationsOpen(false);
    //FILTRAR LOS MENSJAES Y QUEDARSE CON LA PERSONA A LA QUE PERTENECE EL MENSAJE
    const filtroID = notifications.filter((el) => el.id === id);

    setSelectNotf(filtroID[0]);
  };

  //FUNCION PARA ENVIAR EL MENSAJE
  const handleSendMessage = (id: string) => {
    //VER SI EXISTE ERROR EN EL MESNAJE
    const error = validateProfileMessage(message);
    if (error) mostrarError(error, setError);
    else {
      if (user) {
        //CAMBIAR EL STATE DE LOADING A TRUE
        setLoading(true);
        //CREAR EL MENSAJE
        const newMessage: MessageData = {
          id: `${Date.now()}${user.currentUser.uid}`,
          profileTo: id,
          profileOwner: user.uid,
          message: message,
          messageNotification: `${user.displayName} te ha respondido`,
        };

        //ACTUALIZAR LOS MENSAJES DEL USUARIO
        updateDoc(doc(db, "users", id), {
          messages: arrayUnion(newMessage),
        })
          .then(() => {})
          .catch((error) => mostrarError(profileErrors.requestError, setError))
          .finally(() => {
            setLoading(false);
            setMessageOpen(false);
          });
      }
    }
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
          prevMessage={selectNotf.message}
        />
      )}

      {error && (
        <Error
          error={error}
          setFormError={setError}
          position="left-error-position"
        />
      )}

      <div className="navBar">
        <Link to="/">
          <img
            src={
              windowSize > 500
                ? "./images/NavBar-logo.png"
                : "./images/Logo_small.png"
            }
            alt="cuba-commerce-logo"
          />
        </Link>

        <div>
          {user && (
            <MailNotifications
              user={user}
              notifications={notifications}
              handleOpenMessage={handleOpenMessage}
              notificationsOpen={notificationsOpen}
              setNotificationsOpen={setNotificationsOpen}
            />
          )}

          {user ? (
            <>
              <Link to="/addProduct" className="add-product">
                <FaPlus size={20} color="white" />
              </Link>

              <ProfilePhoto profile={user} />
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

export default NavBar;
