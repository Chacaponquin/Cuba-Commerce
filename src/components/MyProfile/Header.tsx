import { Dispatch } from "react";
import { BsX } from "react-icons/bs";
import { FaCamera, FaPenSquare, FaUser } from "react-icons/fa";
import { isEditingOptions } from "../../containers/MyProfile/MyProfile";

interface HeaderProps {
  file: any;
  profileInf: any;
  selectImage: any;
  isEditing: null | string;
  handleSubmit(e: any): void;
  handleChange(e: any): void;
  handleCloseInput(): void;
  setIsEditing: Dispatch<null | string>;
}

const Header = ({
  file,
  selectImage,
  handleChange,
  handleCloseInput,
  handleSubmit,
  isEditing,
  setIsEditing,
  profileInf,
}: HeaderProps): JSX.Element => {
  return (
    <div className="myProfile-header">
      <div className="decoration-section"></div>
      <div className="myProfile-Inf">
        <div className="myProfile-image">
          {file ? (
            <img src={file.source} alt={"profile-pic"} />
          ) : profileInf?.image ? (
            <img src={profileInf.image} alt={profileInf?.nickname} />
          ) : (
            <section className="user-file-select">
              <FaUser color="white" size={40} />
            </section>
          )}

          <FaCamera onClick={selectImage} />
        </div>

        <div className="myProfile-infSection">
          <div className="myProfile-nickname-section">
            <h1>Nickname</h1>
            <div>
              {isEditing === isEditingOptions?.nickname ? (
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    autoFocus
                    spellCheck="false"
                    onChange={handleChange}
                    required
                  />
                  <BsX onClick={handleCloseInput} />
                </form>
              ) : (
                <>
                  <p>{profileInf?.nickname}</p>
                  {!isEditing && (
                    <FaPenSquare
                      size={10}
                      onClick={() => setIsEditing(isEditingOptions.nickname)}
                    />
                  )}
                </>
              )}
            </div>
          </div>

          <div className="myProfile-followers-section">
            <div>
              <p>Followers</p>
              <h1>{profileInf?.followers.length}</h1>
            </div>
            <div>
              <p>Following</p>
              <h1>{profileInf?.following.length}</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
