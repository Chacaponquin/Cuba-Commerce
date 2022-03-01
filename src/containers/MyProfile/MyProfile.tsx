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
import { Dispatch, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useFileUpload } from "use-file-upload";
import { AllProduct, Error, Header, NavBar } from "../../components";
import { ProfileContext } from "../../context/ProfileContext";
import { db, storage } from "../../firebase/client";
import { mostrarError, myProfileErrors } from "../../helpers/errors";
import { validateImage } from "../../helpers/validateImage";
import { validationMyProfile } from "../../helpers/validations";
import "./myProfile.css";

//OPCIONES PARA EDITAR LOS CAMPOS
export const isEditingOptions = {
  nickname: "nickname",
  description: "description",
};

const MyProfile = (): JSX.Element => {
  //EXTRAER CONTEXT DE USER
  const { user } = useContext(ProfileContext);
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
    if (user) {
      //CAMBIAR EL STATE DE LOADING A TRUE
      setLoading(true);
      //CONTRUIR EL QUERY DEL PERFIL A BUSCAR
      const profileQuery = query(
        collection(db, "users"),
        where("id", "==", user.uid)
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
  }, [navigate, user]);

  //FUNCION PARA SELECCIONAR LA IMAGEN
  const selectImage = (): void => {
    selectFile({ multiple: false, accept: "image/*" }, (file: any) => {
      if (validateImage(file)) {
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

              if (user) {
                //ACTUALIZAR EL USUARIO CON LA NUEVA IMAGEN
                await updateProfile(user, { photoURL: imageURL });

                if (user.uid) {
                  //ACTUALIZAR EL USUARIO DE LA COLECCION DE USUARIOS
                  const profileRef = doc(db, "users", user.uid);
                  await updateDoc(profileRef, { image: imageURL });
                }
              }
            })
            .catch((error) =>
              mostrarError(myProfileErrors.requestError, setInputError)
            )
            .finally(() => setLoading(false));
        }
      } else mostrarError(myProfileErrors.imageError, setInputError);
    });
  };

  //FUNCION PARA ENVIAR LOS DATOS Y ACTUALIZAR LOS DATOS DEL USUARIO
  const handleSubmit = (e: any): void => {
    e.preventDefault();

    if (isEditing) {
      const error = validationMyProfile(inputValue, isEditing);

      if (error) mostrarError(error, setInputError);
      else {
        if (user) {
          const profileRef = doc(db, "users", user.uid);
          updateDoc(profileRef, { nickname: inputValue })
            .then(async () => {
              if (user) {
                await updateProfile(user, {
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
  const handleDeleteProduct = (
    id: string,
    setAllProducts: Dispatch<any[]>,
    allProducts: any[]
  ): void => {
    //CREAR LA REFERENCIA DEL PRODUCTO
    const productRef = doc(db, "products", id);

    //PREGUNTAR SI QUIERE ELIMINAR EL PRODUCTO
    const ask = window.confirm("Seguro quiere eliminar este producto?");
    if (ask) {
      //ELIMINAR PRODUCTO
      deleteDoc(productRef)
        .then(() => {
          //ELIMINAR EL PRODUCTO DEL STATE
          setAllProducts(allProducts.filter((el) => el.id !== id));
        })
        .catch((error) => {
          console.log(error);
          setInputError(myProfileErrors.requestError);
        });
    }
  };

  //FUNCION PARA SEÑALAR LA VENTA DE UN PRODUCTO
  const handleSoldProduct = (
    id: string,
    allProducts: any[],
    setAllProducts: Dispatch<any[]>
  ): any => {
    const productRef = doc(db, "products", id);
    updateDoc(productRef, { sold: true })
      .then(() => {
        for (let i = 0; i < allProducts.length; i++) {
          if (allProducts[i].id === id) {
            allProducts[i].sold = true;
            console.log(allProducts[i]);
            break;
          }
        }

        setAllProducts(allProducts);
      })
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
          id={user?.uid}
          handleDeleteProduct={handleDeleteProduct}
          handleSoldProduct={handleSoldProduct}
        />
      </div>
    </>
  );
};

export default MyProfile;
