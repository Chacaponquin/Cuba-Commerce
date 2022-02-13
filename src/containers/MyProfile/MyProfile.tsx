import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useFileUpload } from "use-file-upload";
import { AllProduct, Error, Header, NavBar } from "../../components";
import { db } from "../../firebase/client";
import { mostrarError } from "../../helpers/errors";
import { validationMyProfile } from "../../helpers/validations";
import "./myProfile.css";

//OPCIONES PARA EDITAR LOS CAMPOS
export const isEditingOptions = {
  nickname: "nickname",
  description: "description",
};

const MyProfile = (): JSX.Element => {
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
    selectFile({ multiple: false, accept: "image/*" }, (file: any) => {});
  };

  //FUNCION PARA ENVIAR LOS DATOS Y ACTUALIZAR LOS DATOS DEL USUARIO
  const handleSubmit = (e: any): void => {
    e.preventDefault();
    console.log(inputValue);

    if (isEditing) {
      const error = validationMyProfile(inputValue, isEditing);

      if (error) mostrarError(error, setInputError);
      else {
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
    const profileQuery = query(collection(db, "users"), where("id", "==", id));

    getDocs(profileQuery)
      .then((querySnapshot) => {
        querySnapshot.forEach((profile) => {
          setProfileInf(profile.data());
        });
      })
      .catch((error) => console.log(error));
  }, [id]);

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
          file={file}
          profileInf={profileInf}
        />

        <AllProduct id={id} />
      </div>
    </>
  );
};

export default MyProfile;
