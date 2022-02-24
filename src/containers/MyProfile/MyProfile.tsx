import { Bars } from "@agney/react-loading";
import { updateProfile } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useFileUpload } from "use-file-upload";
import { AllProduct, Error, Header, NavBar } from "../../components";
import { auth, db, storage } from "../../firebase/client";
import { mostrarError, myProfileErrors } from "../../helpers/errors";
import { validationMyProfile } from "../../helpers/validations";
import "./myProfile.css";

//OPCIONES PARA EDITAR LOS CAMPOS
export const isEditingOptions = {
  nickname: "nickname",
  description: "description",
};

const MyProfile = (): JSX.Element => {
  const navigate = useNavigate();
  //STATE DEL LOADING
  const [loading, setLoading] = useState<boolean>(false);
  //STATE DE LA IMAGEN SELECCIONADA
  const [pickImage, setPickImage] = useState<any | null>(null);
  //STATE CON EL PERFIL ENCONTRADO
  const [profileInf, setProfileInf] = useState<any>(null);
  //STATE DE ERROR
  const [inputError, setInputError] = useState<null | string>(null);
  //STATE DE POSIBLE EMAGEN SUBIDA
  const [file, selectFile] = useFileUpload();
  //STATE QUE CONTIENE EL NOMBRE DEL INPUT QUE SE ESTA EDITANDO
  const [isEditing, setIsEditing] = useState<null | string>(null);
  //STATE CON EL CONTENIDO DEL INPUT
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    if (auth.currentUser) {
      //CAMBIAR EL STATE DE LOADING A TRUE
      setLoading(true);
      //CONTRUIR EL QUERY DEL PERFIL A BUSCAR
      const profileQuery = query(
        collection(db, "users"),
        where("id", "==", auth.currentUser.uid)
      );

      //SNAPSHOT DE EL PERFIL
      onSnapshot(
        profileQuery,
        (querySnapshot) => {
          querySnapshot.forEach((profile) => {
            setProfileInf(profile.data());
          });

          setLoading(false);
        },
        (error) => {
          console.log(error);
          setLoading(false);
          navigate("/notFound");
        }
      );
    }
  }, [navigate]);

  //FUNCION PARA SELECCIONAR LA IMAGEN
  const selectImage = (): void => {
    selectFile({ multiple: false, accept: "image/*" }, (file: any) => {
      //PREGUNTAR AL USUARIO SI DESEA CAMBIAR LA FOTO
      const ask = window.confirm("¿Desea cambiar la foto de perfil?");

      //SI NO CONFIRMA SE ELIMINA LA FOTO
      if (!ask) setPickImage(null);
      //EN CASO CONTRARIO
      else {
        //UBICAR LA FOTO EN EL STATE DE FOTO SELECCIONADA
        setPickImage(file);

        //REFERENCIA DE DONDE SE VA A SUBIR
        const imageRef = ref(
          storage,
          `images/user/${profileInf.id}${Date.now()}`
        );

        //CAMBIAR EL STATE DE LOADING A TRUE
        setLoading(true);
        //SUBIR LA IMAGEN
        uploadBytes(imageRef, file.file)
          .then(async (image) => {
            //OBTENER LA URL
            const imageURL = await getDownloadURL(image.ref);

            if (auth.currentUser) {
              //ACTUALIZAR EL USUARIO CON LA NUEVA IMAGEN
              await updateProfile(auth.currentUser, { photoURL: imageURL });

              if (auth.currentUser.uid) {
                //ACTUALIZAR EL USUARIO DE LA COLECCION DE USUARIOS
                const profileRef = doc(db, "users", auth.currentUser.uid);
                await updateDoc(profileRef, { image: imageURL });
              }
            }
          })
          .catch((error) => setInputError(myProfileErrors.requestError))
          .finally(() => setLoading(false));
      }
    });
  };

  //FUNCION PARA ENVIAR LOS DATOS Y ACTUALIZAR LOS DATOS DEL USUARIO
  const handleSubmit = (e: any): void => {
    e.preventDefault();

    if (isEditing) {
      const error = validationMyProfile(inputValue, isEditing);

      if (error) mostrarError(error, setInputError);
      else {
        if (auth.currentUser) {
          const profileRef = doc(db, "users", auth.currentUser.uid);
          updateDoc(profileRef, { nickname: inputValue })
            .then(async () => {
              if (auth.currentUser) {
                await updateProfile(auth.currentUser, {
                  displayName: inputValue,
                });
              }
            })
            .catch((error) => setInputError(myProfileErrors.requestError));
        }
      }
    }

    setIsEditing(null);
  };

  //FUNCION PARA ELIMINAR UN PRODUCTO
  const handleDeleteProduct = (id: string): void => {
    //CREAR LA REFERENCIA DEL PRODUCTO
    const productRef = doc(db, "products", id);
    //ELIMINAR PRODUCTO
    deleteDoc(productRef)
      .then(() => {})
      .catch((error) => {
        console.log(error);
        setInputError(myProfileErrors.requestError);
      });
  };

  //FUNCION PARA SEÑALAR LA VENTA DE UN PRODUCTO
  const handleSoldProduct = (id: string) => {
    const productRef = doc(db, "products", id);
    updateDoc(productRef, { sold: true })
      .then(() => {})
      .catch((error) => console.log(error));
  };

  //FUNCION PARA ACTUALIZAR LO QUE SE ESCRIB EN EL INPUT
  const handleChange = (e: any): void => {
    setInputValue(e.target.value);
  };

  //FUNCION PARA CERRAR EL INPUT
  const handleCloseInput = (): void => {
    setInputValue("");
    setIsEditing(null);
  };

  //SI YA SE TERMINO DE CARGAR Y NO HAY NINGUN PERFIL SE PONE ERROR404
  if (!loading && !profileInf) {
    navigate("/notFound");
  }

  //SI SE ESTA CARGANDO LA INFORMACION SE MUESTRA EL LOADING
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

      {inputError && (
        <Error
          error={inputError}
          setFormError={setInputError}
          position="myProfile-error-position"
        />
      )}

      <div className="myProfile-container">
        <Header
          handleChange={handleChange}
          handleCloseInput={handleCloseInput}
          handleSubmit={handleSubmit}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          selectImage={selectImage}
          file={pickImage}
          profileInf={profileInf}
        />

        <AllProduct
          id={auth.currentUser?.uid}
          handleDeleteProduct={handleDeleteProduct}
          handleSoldProduct={handleSoldProduct}
        />
      </div>
    </>
  );
};

export default MyProfile;
