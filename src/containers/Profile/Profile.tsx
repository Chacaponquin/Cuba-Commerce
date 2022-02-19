import { useState } from "react";
import { BsCardText } from "react-icons/bs";
import { FaCheck, FaPlus } from "react-icons/fa";
import { useParams } from "react-router";
import { NavBar } from "../../components";
import "./profile.css";

const Profile = (): JSX.Element => {
  const { id } = useParams();
  const [follow, setFollow] = useState<boolean>(false);

  const handleFollow = () => {
    setFollow(!follow);
  };

  const handleSendMessage = () => {
    window.alert("Mandando mensaje");
  };

  return (
    <>
      <NavBar />
      <div className="profile-container">
        <div className="profile-header">
          <section className="profile-header-left">
            <img src="./profile.jpg" alt="" />
            <p>Pedro Antonio</p>
          </section>

          <section className="profile-header-right">
            <button onClick={handleSendMessage}>
              <BsCardText size={25} />
              Message
            </button>

            <button
              onClick={handleFollow}
              className={`${follow ? "follow-check" : "follow-uncheck"}`}
            >
              {follow ? <FaCheck size={20} /> : <FaPlus size={25} />}
              Follow
            </button>
          </section>
        </div>

        <div className="profile-products">
          <h1>All Products</h1>

          <section className="profile-allProducts">
            <div style={{ backgroundImage: "url('./product.jpg')" }}></div>
            <div style={{ backgroundImage: "url('./product.jpg')" }}></div>
            <div style={{ backgroundImage: "url('./product.jpg')" }}></div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Profile;
