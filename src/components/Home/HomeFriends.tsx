import React, { useEffect } from "react";

const HomeFriends = (): JSX.Element => {
  useEffect(() => {}, []);

  return (
    <div className="home-friends">
      <div className="profile-friend">
        <img src={"./profile.jpg"} alt="friend" />
        <p>Franscisco Antonio</p>
      </div>
      <div className="profile-friend">
        <img src={"./profile.jpg"} alt="friend" />
        <p>Franscisco Antonio</p>
      </div>
      <div className="profile-friend">
        <img src={"./profile.jpg"} alt="friend" />
        <p>Franscisco Antonio</p>
      </div>
    </div>
  );
};

export default HomeFriends;
