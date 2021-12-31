import { Dispatch } from "react";
import { BsX } from "react-icons/bs";

interface ErrorProps {
  error: string;
  setFormError: Dispatch<null | string>;
  position: string;
}

const Error = ({ error, setFormError, position }: ErrorProps): JSX.Element => {
  return (
    <div className={`error-message slide-top ${position}`}>
      <p>{error}</p>
      <BsX size={45} color="white" onClick={() => setFormError(null)} />
    </div>
  );
};

export default Error;
