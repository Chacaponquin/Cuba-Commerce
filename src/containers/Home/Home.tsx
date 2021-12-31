import React from "react";
import {
  HomeCategories,
  HomeFriends,
  HomePosts,
  NavBar,
} from "../../components";
import "./home.css";

const Home = (): JSX.Element => {
  return (
    <div className="home-container">
      <NavBar />

      <div className="home-principal">
        <HomeCategories />
        <HomePosts />
        <HomeFriends />
      </div>
    </div>
  );
};

export default Home;
