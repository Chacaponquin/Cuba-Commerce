import { useState } from "react";
import { SignUpData } from "../../helpers/types";
import { useForm } from "react-hook-form";
import { FaUser } from "react-icons/fa";
import { validateSignUp } from "../../helpers/validations";
import { useFileUpload } from "use-file-upload";
import { useLoading, Bars } from "@agney/react-loading";
import { auth, storage } from "../../firebase/client";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { signUpErrors } from "../../helpers/errors";
import { Authentication, Error } from "../../components";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "../Login/signIn.css";
import "./signUp.css";

const SignUp = (): JSX.Element => {
  const { containerProps } = useLoading({
    loading: true,
    indicator: <Bars />,
  });

  const history = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  //STATE DE ERROR EN EL FORMULARIO
  const [formError, setFormError] = useState<null | string>(null);
  //STATE DEL LOADING
  const [loading, setLoading] = useState<boolean>(false);
  //STATE DE LA POSIBLE IMAGEN SUBIDA
  const [file, selectFile] = useFileUpload();
  //DEBIDO A QUE NO TENGO EL PROTOTIPO DE LA VARIABLE FILE DE LA LIBRERIA EN ESTE STATE SE GUARDA EL OBJETO FILE
  const [image, setImage] = useState<any>(null);

  //FUNCION PARA MOSTRAR EL ERROR Y DESAPARECERLO DESPUES DE 8 SEGUNDOS
  const mostrarError = (error: string): void => {
    setFormError(error);
    setTimeout(() => setFormError(null), 8000);
  };

  //FUNCION ONSUBMIT PARA VERIFICAR LOS DATOS
  const onSubmit = (data: SignUpData): void => {
    //GUARDAR EN LA VARIABLE ERROR EL POSIBLE ERROR EN EL FORMULARIO
    const error: null | string = validateSignUp(data);

    //SI EL USUARIO INSERTO UNA IMAGEN SE GUARDA EN EL OBJETO DE LOS DATOS DEL FORM
    if (image) {
      data.image = image.file;
    }

    //INSERTAR EN EL STATE ERROR EL ERROR DEVUELTO POR LA FUNCION
    if (error) {
      mostrarError(error);
    } else {
      //PONER EL STATE DE LOADING EN VERDADERO
      setLoading(true);
      //CREAR EL USUARIO EN FIREBASE
      createUserWithEmailAndPassword(auth, data.email, data.password)
        .then(async (userCredentials) => {
          const user = userCredentials.user;

          //ACTUALIZAR EL DISPLAYNAME DEL USUARIO CREADO
          await updateProfile(user, { displayName: data.nickname });

          //SI SE INSERTO UNA IMAGEN SE REALIZAN LAS ACCIONES PARA SUBIR LA FOTO Y GUARDAR LA URL
          if (data.image) {
            const imageRef = ref(storage, `images/user/${user.uid}`);
            const profileImage = await uploadBytes(imageRef, data.image);
            const imageURL = await getDownloadURL(profileImage.ref);

            //ACTUALIZAR LA URL DEL USUARIO
            await updateProfile(user, { photoURL: imageURL });
          }

          //DIRECCIONAR HASTA EL HOME
          history("/");
        })
        .catch((error) => {
          console.log(error.code, error.message);

          if (error.code === "auth/network-request-failed") {
            mostrarError(signUpErrors.requestError);
          }
          if (error.code === "auth/email-already-in-use")
            mostrarError(signUpErrors.emailRepetido);
        })
        .finally(() => setLoading(false));
    }
  };

  const selectImage = (): void => {
    selectFile({ multiple: false, accept: "image/*" }, (file: any): void => {
      setImage(file);
    });
  };

  return (
    <div className="login-container">
      {formError && (
        <Error
          error={formError}
          setFormError={setFormError}
          position="signIn-error-position"
        />
      )}

      <div className="signIn-card">
        {file ? (
          <div className="pictureSelected" onClick={selectImage}>
            <img src={image?.source} alt="profile-preview" />
          </div>
        ) : (
          <div className="select-image-container" onClick={selectImage}>
            <FaUser size={40} color="white" />
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="">Nickname</label>
          <input
            type="text"
            {...register("nickname", { required: true })}
            placeholder="Nickname..."
            spellCheck="false"
            autoComplete="off"
            className={errors.nickname ? "errorActivate" : ""}
          />
          <label htmlFor="">E-mail</label>
          <input
            type="email"
            {...register("email", { required: true })}
            placeholder="your@mail.com"
            spellCheck="false"
            autoComplete="off"
            className={errors.email ? "errorActivate" : ""}
          />
          <label htmlFor="">Password</label>
          <input
            type="password"
            {...register("password", { required: true })}
            placeholder="Password..."
            spellCheck="false"
            className={errors.password ? "errorActivate" : ""}
          />
          <label htmlFor="">Confirm Password</label>
          <input
            type="password"
            {...register("confirmPassword", { required: true })}
            placeholder="Confirm Password..."
            spellCheck="false"
            className={errors.confirmPassword ? "errorActivate" : ""}
          />

          <Authentication mostrarError={mostrarError} />

          {loading ? (
            <div className="loading" {...containerProps}>
              <Bars />
            </div>
          ) : (
            <button>Sign Up</button>
          )}
        </form>

        <a href="/signIn">Ya tienes cuenta?</a>
      </div>
    </div>
  );
};

export default SignUp;
