import { Link } from "react-router-dom";
import DarkModeToggle from "react-dark-mode-toggle";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ColorContext, colors } from "../../context/ColorContext";
import { FaDoorClosed, FaSearch } from "react-icons/fa";
import { BsGear } from "react-icons/bs";
import { auth } from "../../firebase/client";

const ProfileOptions = (): JSX.Element => {
  const navigate = useNavigate();
  //CONTEXT
  const context = useContext(ColorContext);
  //FUNCION PARA CAMBIAR A DARK O LIGHT MODE
  const handleChangeMode = () => {
    context?.setColorMode(
      context.colorMode === colors.LIGHT ? colors.DARK : colors.LIGHT
    );
  };

  return (
    <div className="profile-photo-options">
      <Link to={`/myProfile`} className="photo-option">
        <p>Edit Profile</p>
        <BsGear size={20} />
      </Link>

      <Link to="/search" className="photo-option">
        <p>Search</p>
        <FaSearch size={20} />
      </Link>

      <div className="photo-option">
        <p>Mode</p>
        <DarkModeToggle
          speed={1}
          size={40}
          checked={context?.colorMode === colors.LIGHT ? false : true}
          onChange={handleChangeMode}
        />
      </div>

      <Link
        to={`/`}
        className="photo-option"
        onClick={() => {
          auth.signOut().then(() => {
            window.location.reload();
          });
        }}
      >
        <p>Sign Out</p>
        <FaDoorClosed size={20} />
      </Link>
    </div>
  );
};

export default ProfileOptions;
