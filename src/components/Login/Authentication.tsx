import { signInWithPopup } from "firebase/auth";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { useNavigate } from "react-router";
import { auth, db, provider } from "../../firebase/client";
import { signUpErrors } from "../../helpers/errors";
import { Dispatch } from "react";
import { doc, setDoc } from "firebase/firestore";

interface AuthenticationProps {
  setError: Dispatch<null | string>;
  mostrarError(error: string, setError: Dispatch<null | string>): any;
}

const Authentication = ({
  mostrarError,
  setError,
}: AuthenticationProps): JSX.Element => {
  const navigate = useNavigate();

  const authenticationGoogle = () => {
    signInWithPopup(auth, provider)
      .then(async (result) => {
        //CREAR EL NUEVO OBJETO DEL PERFIL A CREAR
        const newUser = {
          id: result.user.uid,
          image: result.user.photoURL,
          following: [],
          followers: [],
          nickname: result.user.displayName,
        };

        //REFERENCIA DE LA UBICACION DEL ARCHIVO
        const profileRef = doc(db, "users", newUser.id);

        //SUBIR EL NUEVO ARCHIVO
        await setDoc(profileRef, newUser);
        //DIRECCIONAR HASTA EL HOME
        navigate("/");
      })
      .catch((error) => {
        mostrarError(signUpErrors.requestError, setError);
      });
  };

  return (
    <div className="other-methods">
      <div className="method" onClick={authenticationGoogle}>
        <FaGoogle size={25} color="white" />
        <p>Google</p>
      </div>
      <div className="method">
        <FaFacebook size={25} color="white" />
        <p>Facebook</p>
      </div>
    </div>
  );
};

export default Authentication;
