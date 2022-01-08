import { useState } from "react";
import { SignUpData, UsersInfo } from "../../helpers/types";
import { useForm } from "react-hook-form";
import { FaUser } from "react-icons/fa";
import { validateSignUp } from "../../helpers/validations";
import { useFileUpload } from "use-file-upload";
import { useLoading, Bars } from "@agney/react-loading";
import { auth, db, storage } from "../../firebase/client";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { mostrarError, signUpErrors } from "../../helpers/errors";
import { Authentication, Error } from "../../components";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
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

  //FUNCION ONSUBMIT PARA VERIFICAR LOS DATOS
  const onSubmit = (data: SignUpData): void => {
    //GUARDAR EN LA VARIABLE ERROR EL POSIBLE ERROR EN EL FORMULARIO
    const error: null | string = validateSignUp(data);

    //SI EL USUARIO INSERTO UNA IMAGEN SE GUARDA EN EL OBJETO DE LOS DATOS DEL FORM
    if (image) data.image = image.file;

    //INSERTAR EN EL STATE ERROR EL ERROR DEVUELTO POR LA FUNCION
    if (error) mostrarError(error, setFormError);
    else {
      //PONER EL STATE DE LOADING EN VERDADERO
      setLoading(true);
      //CREAR EL USUARIO EN FIREBASE
      createUserWithEmailAndPassword(auth, data.email, data.password)
        .then(async (userCredentials) => {
          const user = userCredentials.user;

          //ACTUALIZAR EL DISPLAYNAME DEL USUARIO CREADO
          await updateProfile(user, { displayName: data.nickname });

          //OBJETO DE NUEVO USUARIO
          let newUser: UsersInfo = {
            followers: [],
            following: [],
            id: userCredentials.user.uid,
            nickname: data.nickname,
          };

          //SI SE INSERTO UNA IMAGEN SE REALIZAN LAS ACCIONES PARA SUBIR LA FOTO Y GUARDAR LA URL
          if (data.image) {
            const imageRef = ref(storage, `images/user/${user.uid}`);
            const profileImage = await uploadBytes(imageRef, data.image);
            const imageURL = await getDownloadURL(profileImage.ref);

            //ANADIR EN EL OBJETO DE NUEVO USUARIO LA URL DE LA IMAGEN SUBIDA
            newUser.image = imageURL;

            //ACTUALIZAR LA URL DEL USUARIO
            await updateProfile(user, { photoURL: imageURL });
          }

          //CREAR LA REFERENCIA DE USUARIOS DONDE SE SUBIRA EL USUARIO
          const usersRef = doc(db, "users", userCredentials.user.uid);
          //SUBIR EL NUEVO USUARIO
          await setDoc(usersRef, newUser);

          //DIRECCIONAR HASTA EL HOME
          history("/");
        })
        .catch((error) => {
          console.log(error.code, error.message);

          if (error.code === "auth/network-request-failed") {
            mostrarError(signUpErrors.requestError, setFormError);
          }
          if (error.code === "auth/email-already-in-use")
            mostrarError(signUpErrors.emailRepetido, setFormError);
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

          <Authentication mostrarError={mostrarError} setError={setFormError} />

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
