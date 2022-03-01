import { collection, getDocs } from "firebase/firestore";
import React, { RefObject, useEffect, Dispatch, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { db } from "../../firebase/client";
import { mostrarError } from "../../helpers/errors";
import { zonas } from "../../helpers/search";
import { orderByOptions } from "../../helpers/searchReducer/orderByOptions";
import { queryConstructor } from "../../helpers/searchReducer/queryConstructor";
import { SearchAction, SearchTypes } from "../../helpers/searchReducer/reducer";
import { SearchParams, AddProductData } from "../../helpers/types";
import { validateSearch } from "../../helpers/validations";

interface SearchOptionsProps {
  searchInputRef: RefObject<HTMLDivElement>;
  searchResultDiv: RefObject<HTMLTableSectionElement>;
  dispatch: Dispatch<SearchAction>;
  searchParams: SearchParams;
  setSearchResult: Dispatch<AddProductData[]>;
  setLoading: Dispatch<boolean>;
  setError: Dispatch<null | string>;
}

const Options = ({
  searchInputRef,
  searchResultDiv,
  dispatch,
  searchParams,
  setSearchResult,
  setLoading,
  setError,
}: SearchOptionsProps): JSX.Element => {
  //STATE DE EL INPUT DE LAS CATEGORIAS
  const [categoryInput, setCategoryInput] = useState<string>("");
  //STATE DE TODAS LAS CATEGORIAS SUGERIDAS
  const [searchCategoryResult, setSearchCategoryResult] = useState<string[]>(
    []
  );

  //USE_EFFECT PARA BUSCAR CATEGORIAS QUE CONTENGAN EL INPUT
  useEffect(() => {
    //SI NO ESTA VACIO EL INPUT SE BUSCAN TODAS LAS CATEGORIAS
    if (categoryInput.length) {
      getDocs(collection(db, "categories")).then((query) => {
        //SE INTRODUCEN EN UN ARRAY
        let allCategories: any[] = [];
        query.forEach((category) => {
          allCategories.push(category.data());
        });

        //SE FILTRAN PARA QUE SOLO QUEDEN LAS QUE TENGAN ALGO RELACIONADO CON LO ESCRITO EN EL INPUT
        const categoriesIncludes = allCategories.filter((category) =>
          category.category.toLowerCase().includes(categoryInput.toLowerCase())
        );

        //SE INCLUYEN EN EL STATE DE SEARCH_CATEGORY_RESULT
        setSearchCategoryResult(categoriesIncludes);
      });
    }
    //EN CASO CONTRARIO SE PONE UN ARRAY VACIO A LAS CATEGORIAS ENCONTRADAS
    else setSearchCategoryResult([]);
  }, [categoryInput, setSearchCategoryResult]);

  //FUNCION PARA CAMBIAR EN EL ESTADO LA NUEVA ZONA
  const handleZonaChange = (e: any) => {
    dispatch({ type: SearchTypes.ADD_ZONA, payload: e.target.value });
  };

  //FUNCION PARA HACER LA BUSQUEDA
  const handleSubmitSearch = () => {
    //VER SI EXISTE ALGUN ERROR EN LOS PARAMETROS
    const error = validateSearch(searchParams);

    if (error) mostrarError(error, setError);
    else {
      //CONSTRUIR LA QUERY CON TODOS LOS PARAMETROS A BUSCAR
      const querySend = queryConstructor(searchParams);

      //CAMBIAR EL STATE DE LOADING A TRUE
      setLoading(true);
      //OBTENER LOS PRODUCTOS QUE CUMPLAN CON LOS PARAMETROS INDICADOS
      getDocs(querySend)
        .then((query) => {
          //INTRODUCIR TODOS LOS PRODUCTOS EN UN ARRAY
          let allSearchProduct: any[] = [];
          query.forEach((product: any) => {
            allSearchProduct.push(product.data());
          });

          //PONERLOS EN EL STATE DE SEARCH RESULT
          setSearchResult(allSearchProduct);
        })
        .catch((error) => console.log(error))
        .finally(() => setLoading(false));
    }
  };

  return (
    <div className="search-params">
      <div className="searchParams-div">
        <p>Nombre</p>
        <input
          type="text"
          onChange={(e) => {
            dispatch({ type: SearchTypes.ADD_NAME, payload: e.target.value });
          }}
        />
      </div>

      <div className="searchParams-div">
        <p>Categoria</p>
        <div ref={searchInputRef}>
          <input
            type="text"
            onChange={(e) => setCategoryInput(e.target.value)}
            value={categoryInput}
          />
          <FaSearch size={15} />
        </div>

        <section className="search-result" ref={searchResultDiv}>
          {searchCategoryResult.map((category: any, i: number) => (
            <h1
              key={i}
              onClick={() => {
                dispatch({
                  type: SearchTypes.ADD_CATEGORY,
                  payload: category.category,
                });
                setCategoryInput(category.category);
                setSearchCategoryResult([]);
              }}
            >
              {category.category}
            </h1>
          ))}
        </section>
      </div>

      <div className="searchParams-div">
        <p>Zona</p>
        <select onChange={handleZonaChange}>
          {zonas.map((zona: string, i: number) => (
            <option value={zona} key={i}>
              {zona}
            </option>
          ))}
        </select>
      </div>

      <div className="searchParams-div">
        <p>Precio min</p>
        <div className="precio-input">
          <input
            type="number"
            onChange={(e) =>
              dispatch({
                type: SearchTypes.ADD_PRICE_MIN,
                payload: Number(e.target.value),
              })
            }
          />
        </div>
      </div>

      <div className="searchParams-div">
        <p>Precio max</p>
        <div className="precio-input">
          <input
            type="number"
            onChange={(e) =>
              dispatch({
                type: SearchTypes.ADD_PRICE_MAX,
                payload: Number(e.target.value),
              })
            }
          />
        </div>
      </div>

      <OrderByContainer dispatch={dispatch} />

      <button onClick={handleSubmitSearch}>Search</button>
    </div>
  );
};

interface OrderByContainerProps {
  dispatch: Dispatch<SearchAction>;
}

const OrderByContainer = ({ dispatch }: OrderByContainerProps): JSX.Element => {
  //FUNCION PARA CAMBIAR EN EL ESTADO LA FORMA DE ORDEN
  const handleChange = (e: any) => {
    dispatch({ type: SearchTypes.ADD_ORDERBY, payload: e.target.value });
  };

  return (
    <div className="searchParams-div">
      <p>Ordenar por</p>
      <select
        defaultValue={orderByOptions.MAYOR_PRECIO}
        onChange={handleChange}
      >
        {Object.values(orderByOptions).map((order: string, i: number) => (
          <option value={order} key={i}>
            {order}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Options;
