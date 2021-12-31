import { useState } from "react";
import { useForm } from "react-hook-form";
import { SignInData } from "../../helpers/types";
import { useLoading, Bars } from "@agney/react-loading";
import { auth } from "../../firebase/client";
import { Authentication, Error } from "../../components";
import "./signIn.css";
import "../SignUp/signUp.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { signInErrors } from "../../helpers/errors";
import { useNavigate } from "react-router";

const SignIn = (): JSX.Element => {
  const navigate = useNavigate();

  //STATE DEL LOADING
  const [loading, setLoading] = useState<boolean>(false);
  //STATE DE ERROR DE FORMULARIO
  const [formError, setFormError] = useState<null | string>(null);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const { containerProps } = useLoading({ loading: true, indicator: <Bars /> });

  //FUNCION ONSUBMIT PARA VERIFICAR LOS DATOS
  const onSubmit = (data: SignInData) => {
    setLoading(true);
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredentials) => {
        //DIRECCIONAR HASTA EL HOME
        navigate("/");
      })
      .catch((error) => {
        console.log(error.code);

        if (error.code === "auth/wrong-password") {
          mostrarError(signInErrors.wrongPassword);
        } else if (error.code === "auth/user-not-found") {
          mostrarError(signInErrors.userNotFound);
        } else {
          mostrarError(signInErrors.requestError);
        }
      })
      .finally(() => setLoading(false));
  };

  //FUNCION PARA MOSTRAR EL ERROR Y ELIMINARLO DESPUES DE 8 SEGUNDOS
  const mostrarError = (error: string): void => {
    setFormError(error);
    setTimeout(() => setFormError(null), 8000);
  };

  return (
    <div className="login-container">
      <div className="signIn-card">
        {formError && (
          <Error
            error={formError}
            setFormError={setFormError}
            position="signIn-error-position"
          />
        )}

        <img src="./commerce-logo.png" alt="commerce-logo" />

        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="">Email</label>
          <input
            type="text"
            {...register("email", { required: true })}
            placeholder="your@example.com"
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

          <Authentication mostrarError={mostrarError} />

          {loading ? (
            <div className="loading" {...containerProps}>
              <Bars />
            </div>
          ) : (
            <button>Sign Up</button>
          )}
        </form>

        <a href="/signUp">No tienes cuenta?</a>
      </div>
    </div>
  );
};

export default SignIn;
