import { Bars } from "@agney/react-loading";
import { updateProfile } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useFileUpload } from "use-file-upload";
import { Error404 } from "..";
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
  //STATE DEL LOADING
  const [loading, setLoading] = useState<boolean>(false);

  const [pickImage, setPickImage] = useState<any | null>(null);

  //STATE CON EL PERFIL ENCONTRADO
  const [profileInf, setProfileInf] = useState<any>(null);
  //EXTRAER EL ID A BUSCAR DE LA RUTA
  const { id } = useParams();

  //STATE DE ERROR
  const [inputError, setInputError] = useState<null | string>(null);

  //STATE DE POSIBLE EMAGEN SUBIDA
  const [file, selectFile] = useFileUpload();

  //STATE QUE CONTIENE EL NOMBRE DEL INPUT QUE SE ESTA EDITANDO
  const [isEditing, setIsEditing] = useState<null | string>(null);

  //STATE CON EL CONTENIDO DEL INPUT
  const [inputValue, setInputValue] = useState<string>("");

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

              if (id) {
                //ACTUALIZAR EL USUARIO DE LA COLECCION DE USUARIOS
                const profileRef = doc(db, "users", id);
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
        if (id) {
          const profileRef = doc(db, "users", id);
          updateDoc(profileRef, { nickname: inputValue })
            .then(async () => {
              if (auth.currentUser) {
                await updateProfile(auth.currentUser, {
                  displayName: inputValue,
                });

                console.log("Hola");
              }
            })
            .catch((error) => setInputError(myProfileErrors.requestError));
        }
      }
    }

    setIsEditing(null);
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

  useEffect(() => {
    //CAMBIAR EL STATE DE LOADING A TRUE
    setLoading(true);
    //CONTRUIR EL QUERY DEL PERFIL A BUSCAR
    const profileQuery = query(collection(db, "users"), where("id", "==", id));

    getDocs(profileQuery)
      .then((querySnapshot) => {
        querySnapshot.forEach((profile) => {
          setProfileInf(profile.data());
        });
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, [id]);

  //SI YA SE TERMINO DE CARGAR Y NO HAY NINGUN PERFIL SE PONE ERROR404
  if (!loading && !profileInf) {
    return <Error404 />;
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

        <AllProduct id={id} />
      </div>
    </>
  );
};

export default MyProfile;
