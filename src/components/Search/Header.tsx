import { FaSearch } from "react-icons/fa";

const Header = (): JSX.Element => {
  return (
    <div className="search-header">
      <h1>Search</h1>
      <FaSearch size={80} />
    </div>
  );
};

export default Header;
