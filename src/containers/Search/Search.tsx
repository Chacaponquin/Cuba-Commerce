import { Bars } from "@agney/react-loading";
import { useLayoutEffect, useReducer, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Error, NavBar, SearchHeader, SearchOptions } from "../../components";
import { orderByOptions } from "../../helpers/searchReducer/orderByOptions";
import { searchReducer } from "../../helpers/searchReducer/reducer";
import { SearchParams, AddProductData } from "../../helpers/types";
import "./search.css";

const initialSearch: SearchParams = {
  order: orderByOptions.MAYOR_PRECIO,
};

const Search = (): JSX.Element => {
  //STATE DE ERROR
  const [error, setError] = useState<null | string>(null);
  //STATE DE LOADING
  const [loading, setLoading] = useState<boolean>(false);
  //REF DEL CONTENEDOR DEL RESULTADO
  const searchResultDiv = useRef<HTMLTableSectionElement>(null);
  const searchInputRef = useRef<HTMLDivElement>(null);
  //REDUCER DE LOS PARAMETROS DE LA BUSQUEDA
  const [searchParams, dispatch] = useReducer(searchReducer, initialSearch);
  //RESULTADOS DE LA BUSQUEDA
  const [searchResult, setSearchResult] = useState<AddProductData[]>([]);

  //FUNCION PARA UBICAR LOS ELEMENTOS
  const ubicateResultSearch = (): void => {
    if (searchResultDiv.current?.style && searchInputRef.current) {
      searchResultDiv.current.style.transform = `translateY(${
        searchInputRef.current.clientHeight + 35
      }px)`;

      searchResultDiv.current.style.width = `${searchInputRef.current.clientWidth}px`;
    }
  };

  useLayoutEffect(() => {
    //UBICAR ELEMENTOS
    ubicateResultSearch();

    //CADA VEZ QUE LA QUE CAMBIE EL TAMANO DE LA VENTANA SE VUELVEN A UBICAR LOS ELEMENTOS
    window.addEventListener("resize", ubicateResultSearch);
  }, []);

  return (
    <>
      <NavBar />

      <div className="search-container">
        {error && (
          <Error
            error={error}
            setFormError={setError}
            position="search-error"
          />
        )}

        <SearchHeader />
        <div className="search-content-div">
          <SearchOptions
            searchInputRef={searchInputRef}
            searchResultDiv={searchResultDiv}
            dispatch={dispatch}
            searchParams={searchParams}
            setSearchResult={setSearchResult}
            setLoading={setLoading}
            setError={setError}
          />

          <div className="search-posts">
            {loading ? (
              <Bars />
            ) : searchResult.length ? (
              searchResult.map((product: AddProductData, i: number) => (
                <Link
                  to={`/product/${product.id}`}
                  className="post-search"
                  key={i}
                >
                  <img src={product.images[0]} alt={product.name} />
                  <div>
                    <p>{product.name}</p>
                    <p>${product.price}</p>
                  </div>
                </Link>
              ))
            ) : (
              <h1>No se encontraron resultados</h1>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Search;
