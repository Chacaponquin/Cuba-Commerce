import { NavBar } from "../../components";
import "./search.css";

const Search = (): JSX.Element => {
  return (
    <>
      <NavBar />

      <div className="search-container">
        <div className="search-header">
          <img src="bg.jpg" alt="background" />
        </div>
      </div>
    </>
  );
};

export default Search;
