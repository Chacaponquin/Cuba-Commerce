import React, { RefObject } from "react";
import { FaSearch } from "react-icons/fa";

interface SearchHeaderProps {
  searchDivHeader: RefObject<HTMLDivElement>;
}

const Header = ({ searchDivHeader }: SearchHeaderProps): JSX.Element => {
  return (
    <div className="search-header">
      <img src="bg.jpg" alt="background" />

      <div className="inputSearch-header" ref={searchDivHeader}>
        <input type="text" placeholder="Buscar..." />
        <FaSearch size={30} />
      </div>
    </div>
  );
};

export default Header;
