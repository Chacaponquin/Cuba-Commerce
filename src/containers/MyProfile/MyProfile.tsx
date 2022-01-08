import { useState } from "react";
import { useFileUpload } from "use-file-upload";
import { AllProduct, Error, Header, NavBar } from "../../components";
import { mostrarError } from "../../helpers/errors";
import { validationMyProfile } from "../../helpers/validations";
import "./myProfile.css";

//OPCIONES PARA EDITAR LOS CAMPOS
export const isEditingOptions = {
  nickname: "nickname",
  description: "description",
};

const MyProfile = () => {
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
        />

        <AllProduct />
      </div>
    </>
  );
};

export default MyProfile;
