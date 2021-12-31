import React from "react";

const HomePosts = (): JSX.Element => {
  return (
    <>
      <div className="home-posts">
        <div className="post">
          <img src="./product.jpg" alt="" />
          <div>
            <h1>Chancletas tu madre</h1>

            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Commodi
              nisi a distinctio harum pariatur accusantium omnis ratione
              consequuntur atque quaerat, libero, id corrupti obcaecati esse?
            </p>

            <div className="post-categories">
              <button className="post-category">#carros</button>
              <button className="post-category">#yeah baby</button>
              <button className="post-category">#carros</button>
              <button className="post-category">#wa</button>
              <button className="post-category">#wa</button>
            </div>

            <div className="product-owner">
              <img src="./profile.jpg" alt="" />
              <p>Pedro Alberto</p>
            </div>
          </div>
        </div>

        <div className="post"></div>

        <div className="post"></div>

        <div className="post"></div>
      </div>
    </>
  );
};

export default HomePosts;
