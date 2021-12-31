import { Dispatch } from "react";
import { BsX } from "react-icons/bs";
import { FaCamera, FaPen } from "react-icons/fa";
import { isEditingOptions } from "../../containers/MyProfile/MyProfile";

interface HeaderProps {
  file: any;
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
}: HeaderProps): JSX.Element => {
  return (
    <div className="myProfile-header">
      <div className="decoration-section"></div>
      <div className="myProfile-Inf">
        <div className="myProfile-image">
          <img src={file ? file.source : "./profile.jpg"} alt="profileView" />
          <FaCamera onClick={selectImage} />
        </div>

        <div className="myProfile-infSection">
          <h1>Nickname</h1>
          <div>
            {isEditing === isEditingOptions.nickname ? (
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
                <p>Rigoberto Antonio</p>
                {!isEditing && (
                  <FaPen
                    onClick={() => setIsEditing(isEditingOptions.nickname)}
                  />
                )}
              </>
            )}
          </div>

          <h1 className="myProfile-description-label">Description</h1>
          <div className="myProfile-description">
            {isEditing === isEditingOptions.description ? (
              <form>
                <textarea
                  rows={3}
                  cols={55}
                  autoFocus
                  spellCheck="false"
                  onChange={handleChange}
                  required
                ></textarea>
                <BsX onClick={handleCloseInput} />
              </form>
            ) : (
              <>
                <p>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Autem dicta omnis maxime quae in atque libero et dolor,
                  voluptates corrupti quis, voluptas ullam nobis!
                </p>
                {!isEditing && (
                  <FaPen
                    onClick={() => setIsEditing(isEditingOptions.description)}
                  />
                )}
              </>
            )}
          </div>

          <div className="myProfile-followers-section">
            <div>
              <p>Followers</p>
              <h1>234</h1>
            </div>
            <div>
              <p>Following</p>
              <h1>56</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
