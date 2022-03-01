import { Bars } from "@agney/react-loading";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useContext, useEffect, useRef, useState } from "react";
import { BsCardText } from "react-icons/bs";
import { useNavigate, useParams } from "react-router";
import { Error, NavBar, SendMessageContainer } from "../../components";
import { db } from "../../firebase/client";
import { mostrarError, profileErrors } from "../../helpers/errors";
import { validateProfileMessage } from "../../helpers/validations";
import { MessageData } from "../../helpers/types";
import { Link } from "react-router-dom";
import { ProfileContext } from "../../context/ProfileContext";
import "./product.css";

const Product = (): JSX.Element => {
  const { user } = useContext(ProfileContext);
  const navigate = useNavigate();
  //EXTRAER EL ID DEL PRODUCTO DE LA RUTA
  const { productID } = useParams();
  //STATE CON EL PRODUCTO ENCONTRADO
  const [productFound, setProductFound] = useState<any | null>(null);
  //STATE CON TODAS LAS IMAGENES DEL PRODUCTO
  const [allImages, setAllImages] = useState<string[]>([]);
  //STATE DE LOADING
  const [loading, setLoading] = useState<boolean>(false);
  //REFERENCIA DEL CONTADOR
  const cont = useRef<number>(0);
  //STATE DE LA URL DE LA IMAGEN SELECCIONADA
  const [selectImage, setSelectImage] = useState<string>("");
  //STATE DEL LOADING CUANDO SE ESTA ENVIANDO UN MENSAJE
  const [messageLoading, setMessageLoading] = useState<boolean>(false);
  //STATE PARA SABER SI SE ESTA REDACTANDO UN MENSAJE
  const [messageOpen, setMessageOpen] = useState<boolean>(false);
  //STATE QUE CONTIENE EL MENSAJE A ENVIAR
  const [message, setMessage] = useState("");
  //STATE DE ERROR
  const [error, setError] = useState<null | string>(null);

  //USEEFFECT PARA OBTENCION DEL PRODUCTO A PARTIR DEL ID
  useEffect(() => {
    //CAMBIAR LOADING A TRUE
    setLoading(true);

    //CREAR LA QUERY DEL PRODUCTO A BUSCAR
    const productQuery = query(
      collection(db, "products"),
      where("id", "==", productID)
    );

    getDocs(productQuery)
      .then(async (querySnapshot) => {
        let productFound: any;
        querySnapshot.forEach((product) => {
          productFound = product.data();
        });

        //INTRODUCIR LOS DATOS EN LOS STATES
        setProductFound(productFound);
        setAllImages(productFound.images);
        setSelectImage(productFound.images[0]);

        //CONSTRUIR LA QUERY DEL PERFIL DEL CREADOR DEL PRODUCTO
        const profileQuery = query(
          collection(db, "users"),
          where("id", "==", productFound.creatorID)
        );

        //OBTENER LA INFORMACION DEL USUARIO
        const profileFound = await getDocs(profileQuery);
        profileFound.forEach((profile) => {
          const data = profile.data();
          //INSERTAR EN EL STATE DEL PRODUCTO ENCONTRADO LA IMAGEN Y NOMBRE DEL CREADOR
          setProductFound({
            ...productFound,
            creatorID: {
              id: productFound.creatorID,
              image: data.image,
              name: data.nickname,
            },
          });
        });
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, [productID]);

  //USEEFFECT PARA CAMBIAR AUTOMATICAMENTE LAS FOTOS
  useEffect(() => {
    if (allImages.length) {
      setInterval(() => {
        cont.current =
          cont.current === allImages.length - 1 ? 0 : cont.current + 1;
        setSelectImage(allImages[cont.current]);
      }, 7000);
    }
  }, [allImages]);

  //FUNCION PARA ENVIAR UN MENSAJE AL USUARIO
  const handleSendMessage = (id: string) => {
    const error = validateProfileMessage(message);
    if (error) mostrarError(error, setError);
    else {
      if (productFound?.creatorID.id && user) {
        //CONSTRUIR MENSAJE
        const newMessage: MessageData = {
          id: `${Date.now()}${user.uid}`,
          profileTo: id,
          profileOwner: user.uid,
          message: message,
          messageNotification: `A ${user.displayName} le interesa el producto ${productFound.name}`,
        };

        //CAMBIAR EL STATE DE LOADING A TRUE
        setMessageLoading(true);
        //ACTUALIZAR LOS MENSAJES DEL USUARIO
        updateDoc(doc(db, "users", id), {
          messages: arrayUnion(newMessage),
        })
          .then(() => {
            //REDIRECCIONAR AL HOME
            navigate("/");
          })
          .catch((error) => mostrarError(profileErrors.requestError, setError))
          .finally(() => setMessageLoading(false));
      }
    }
  };

  //SI SE ESTA CARGANDO LA PETICION MUESTRA EL LOADING
  if (loading) {
    return (
      <div className="product-loading">
        <Bars />
      </div>
    );
  }

  return (
    <>
      <NavBar />

      {messageOpen && (
        <SendMessageContainer
          handleSendMessage={handleSendMessage}
          setMessageOpen={setMessageOpen}
          loading={messageLoading}
          setMessage={setMessage}
          profile={{
            name: productFound.creatorID.name,
            id: productFound.creatorID.id,
          }}
        />
      )}

      <div className="product-container">
        {error && (
          <Error
            error={error}
            setFormError={setError}
            position="right-error-position"
          />
        )}
        <div className="product-header">
          <div className="product-header-inf">
            <h1>{productFound?.name}</h1>
            <p>${productFound?.price}</p>
          </div>

          <img src={selectImage} alt={productFound?.name} />

          <div className="product-header-creator">
            <Link to={`/profile/${productFound?.creatorID.id}`}>
              {productFound?.creatorID.image && (
                <img
                  src={productFound?.creatorID.image}
                  alt={productFound?.creatorID.name}
                />
              )}
              <h1>{productFound?.creatorID.name}</h1>
            </Link>

            <button onClick={() => setMessageOpen(true)}>
              <BsCardText size={25} />
              Message
            </button>
          </div>
        </div>

        <div className="product-images">
          {allImages.map((image: string, i: number) => (
            <img
              key={i}
              className={`product-image ${
                selectImage === image ? "image-select" : ""
              }`}
              src={image}
              alt=""
              onClick={() => {
                cont.current = i - 1;
                setSelectImage(image);
              }}
            />
          ))}
        </div>

        <div className="product-inf-section">
          <section className="section-label">
            <h1>Categories</h1>
          </section>
          <div className="product-categories">
            {productFound?.categories.map((category: string, i: number) => (
              <div key={i}>#{category}</div>
            ))}
          </div>

          <section className="section-label">
            <h1>Description</h1>
          </section>
          <div className="product-description">
            <p>{productFound?.description}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;
