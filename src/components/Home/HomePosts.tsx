import { Bars } from "@agney/react-loading";
import { Dispatch } from "react";

interface HomePostsProps {
  posts: any[];
  loading: boolean;
  setSelectCategory: Dispatch<null | string>;
  selectCategory: null | string;
}

const HomePosts = ({
  posts,
  loading,
  setSelectCategory,
  selectCategory,
}: HomePostsProps): JSX.Element => {
  return (
    <>
      <div className="home-posts">
        {loading ? (
          <div className="home-loading">
            <Bars />
          </div>
        ) : (
          <>
            {selectCategory && (
              <div className="category-header-select">
                <p>#{selectCategory}</p>
              </div>
            )}

            {posts.map((post, i: number) => (
              <HomePost
                key={i}
                post={post}
                setSelectCategory={setSelectCategory}
              />
            ))}
          </>
        )}
      </div>
    </>
  );
};

interface HomePostProps {
  post: any;
  setSelectCategory: Dispatch<null | string>;
}

const HomePost = ({ post, setSelectCategory }: HomePostProps): JSX.Element => {
  return (
    <div className="post">
      <a href={`/product/${post.id}`}>
        <img src={post.images[0]} alt={post.name} />
      </a>

      <div>
        <h1>{post.name}</h1>
        <p>{post.description}</p>

        <div className="post-categories">
          {post.categories &&
            post.categories.map((category: string, i: number) => (
              <button
                key={i}
                className="post-category"
                onClick={() => setSelectCategory(category)}
              >
                #{category}
              </button>
            ))}
        </div>

        <div className="product-owner">
          <img
            src={post.creatorID.image ? post.creatorID.image : "./profile.jpg"}
            alt={post.creatorID.nickname}
          />
          <p>{post.creatorID.nickname}</p>
        </div>
      </div>
    </div>
  );
};

export default HomePosts;
