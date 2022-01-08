import { SearchParams } from "../types";

export enum SearchTypes {
  ADD_CATEGORY = "ADD_CATEGORY",
  ADD_PRICE_MAX = "ADD_PRICE_MAX",
  ADD_PRICE_MIN = "ADD_PRICE_MIN",
  ADD_ZONA = "ADD_ZONA",
  ADD_ORDERBY = "ADD_ORDER_BY",
}

export interface SearchAction {
  type: SearchTypes;
  payload: any;
}

//REDUCER DE LOS PARAMETROS DE BUSQUEDA
export const searchReducer = (
  searchParams: SearchParams,
  action: SearchAction
) => {
  switch (action.type) {
    case SearchTypes.ADD_CATEGORY:
      return { ...searchParams, category: action.payload };
    case SearchTypes.ADD_PRICE_MAX:
      return { ...searchParams, priceMax: action.payload };
    case SearchTypes.ADD_PRICE_MIN:
      return { ...searchParams, priceMin: action.payload };
    case SearchTypes.ADD_ZONA:
      return { ...searchParams, zona: action.payload };
    case SearchTypes.ADD_ORDERBY:
      return { ...searchParams, order: action.payload };
    default:
      return searchParams;
  }
};
