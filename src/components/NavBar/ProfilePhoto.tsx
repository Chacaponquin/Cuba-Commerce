import { useState } from "react";
import { FaUser } from "react-icons/fa";
import ProfileOptions from "./ProfileOptions";

interface ProfilePicture {
  profile: any;
}

const ProfilePhoto = ({ profile }: ProfilePicture): JSX.Element => {
  //EXTRAER LA FOTO DEL OBJETO USUARIO
  const picture = profile.photoURL;
  //STATE PARA VER SI ESTAN ABIERTAS LAS OPCIONES
  const [optionsOpen, setOptionsOpen] = useState<boolean>(false);

  return (
    <div className="profilePhoto">
      {picture ? (
        <section>
          <img
            src={picture}
            alt={profile.displayName}
            onClick={() => setOptionsOpen(!optionsOpen)}
          />

          {optionsOpen && <ProfileOptions />}
        </section>
      ) : (
        <section>
          <div
            className="no-picture"
            onClick={() => setOptionsOpen(!optionsOpen)}
          >
            <FaUser color="white" size={25} />
          </div>

          {optionsOpen && <ProfileOptions />}
        </section>
      )}
    </div>
  );
};

export default ProfilePhoto;
