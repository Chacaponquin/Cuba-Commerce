import { signInWithPopup } from "firebase/auth";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { useNavigate } from "react-router";
import { auth, provider } from "../../firebase/client";
import { signUpErrors } from "../../helpers/errors";

interface AuthenticationProps {
  mostrarError(error: string): any;
}

const Authentication = ({ mostrarError }: AuthenticationProps): JSX.Element => {
  const navigate = useNavigate();

  const authenticationGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        //DIRECCIONAR HASTA EL HOME
        navigate("/");
      })
      .catch((error) => {
        mostrarError(signUpErrors.requestError);
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
