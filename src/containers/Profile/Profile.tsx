import { Bars } from "@agney/react-loading";
import { useState, Dispatch, useEffect } from "react";
import { BsCardText, BsX } from "react-icons/bs";
import { FaCheck, FaPlus } from "react-icons/fa";
import { useNavigate, useParams } from "react-router";
import { NavBar, ProfileLoading } from "../../components";
import { auth } from "../../firebase/client";
import { MessageData } from "../../helpers/types";
import { Error } from "../../components";
import "./profile.css";
import { validateProfileMessage } from "../../helpers/validations";
import { mostrarError } from "../../helpers/errors";

interface SendMessageProps {
  handleSendMessage(): any;
  setMessageOpen: Dispatch<boolean>;
  setMessage: Dispatch<string>;
  loading: boolean;
}

const Profile = (): JSX.Element => {
  //EXTRAER EL ID DEL USUARIO DE LA RUTA
  const { id } = useParams();
  const navigate = useNavigate();
  //STATE PARA SABER SI SE SIGUE AL USUARIO
  const [follow, setFollow] = useState<boolean>(false);
  //STATE PARA SABER SI SE ESTA REDACTANDO UN MENSAJE
  const [messageOpen, setMessageOpen] = useState<boolean>(false);
  //STATE DEL LOADING CUANDO SE ESTA ENVIANDO UN MENSAJE
  const [messageLoading, setMessageLoading] = useState<boolean>(false);
  //STATE DEL LOADING CUANDO SE ESTAN OBTENIENDO LOS PRODUCTOS
  const [productLoading, setProductLoading] = useState<boolean>(false);
  //STATE QUE CONTIENE EL MENSAJE A ENVIAR
  const [message, setMessage] = useState("");
  //STATE DE ERROR
  const [error, setError] = useState<null | string>(null);
  //STATE CON LA INFORMACION DEL USUARIO
  const [profileInf, setProfileInf] = useState<null | any>(null);

  //FUNCION PARA SEGUIR AL USUARIO
  const handleFollow = () => {
    setFollow(!follow);
  };

  //FUNCION PARA ENVIAR UN MENSAJE AL USUARIO
  const handleSendMessage = () => {
    const error = validateProfileMessage(message);
    if (error) mostrarError(error, setError);
    else {
      if (id && auth.currentUser) {
        const newMessage: MessageData = {
          id: `${Date.now}${id}`,
          profileTo: id,
          profileOwner: auth.currentUser.uid,
          message: message,
        };

        console.log(newMessage);

        //REDIRECCIONAR AL HOME
        navigate("/");
      }
    }
  };

  /*useEffect(() => {
    if (!id) navigate("/notFound");
  }, [id]);*/

  return (
    <>
      <NavBar />
      <div className="profile-container">
        {error && (
          <Error
            error={error}
            setFormError={setError}
            position="right-error-position"
          />
        )}

        {messageOpen && (
          <SendMessageContainer
            handleSendMessage={handleSendMessage}
            setMessageOpen={setMessageOpen}
            loading={messageLoading}
            setMessage={setMessage}
          />
        )}

        <div className="profile-header">
          <section className="profile-header-left">
            <img src="./profile.jpg" alt="" />
            <p>Pedro Antonio</p>
          </section>

          <section className="profile-header-right">
            <button onClick={() => setMessageOpen(true)}>
              <BsCardText size={25} />
              Message
            </button>

            <button
              onClick={handleFollow}
              className={`${follow ? "follow-check" : "follow-uncheck"}`}
            >
              {follow ? <FaCheck size={20} /> : <FaPlus size={25} />}
              Follow
            </button>
          </section>
        </div>

        <div className="profile-products">
          <h1>All Products</h1>
          {productLoading ? <ProfileLoading /> : <ProfileProducts />}
        </div>
      </div>
    </>
  );
};

const ProfileProducts = (): JSX.Element => {
  return (
    <section className="profile-allProducts">
      <div style={{ backgroundImage: "url('./product.jpg')" }}>
        <h1>$235</h1>
      </div>

      <div style={{ backgroundImage: "url('./product.jpg')" }}></div>

      <div style={{ backgroundImage: "url('./product.jpg')" }}></div>
    </section>
  );
};

const SendMessageContainer = ({
  handleSendMessage,
  setMessageOpen,
  setMessage,
  loading,
}: SendMessageProps): JSX.Element => {
  return (
    <div className="sendMessage-container">
      <section className="sendMessage-input">
        <h1>
          Para: Patricio Adalberto{" "}
          <BsX size={40} onClick={() => setMessageOpen(false)} />
        </h1>
        <textarea
          required
          cols={70}
          rows={5}
          placeholder="Message..."
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <div>
          {loading ? (
            <Bars />
          ) : (
            <button onClick={handleSendMessage}>Send</button>
          )}
        </div>
      </section>
    </div>
  );
};

export default Profile;
