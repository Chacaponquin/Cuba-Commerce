import { collection, limit, orderBy, query, where } from "firebase/firestore";
import { db } from "../../firebase/client";
import { SearchParams } from "../types";
import { orderByOptions } from "./orderByOptions";

export const queryConstructor = (searchData: SearchParams) => {
  let orderQuery = null;
  let categoryQuery = null;
  let priceMaxQuery = null;
  let priceMinQuery = null;
  let existParams: any[] = [];

  const { order, category, priceMax, priceMin } = searchData;
  if (order) {
    if (order === orderByOptions.MAYOR_PRECIO) {
      orderQuery = orderBy("price", "desc");
    } else if (order === orderByOptions.MENOR_PRECIO) {
      orderQuery = orderBy("price", "asc");
    }

    existParams.push(orderQuery);
  }

  if (category) {
    categoryQuery = where("products", "array-contains", category);
    existParams.push(categoryQuery);
  }

  if (priceMax) {
    priceMaxQuery = where("price", "<=", priceMax);
    existParams.push(priceMaxQuery);
  }

  if (priceMin) {
    priceMinQuery = where("price", ">=", priceMin);
    existParams.push(priceMinQuery);
  }

  return checkParams(existParams);
};

const checkParams = (paramsArray: any[]) => {
  switch (paramsArray.length) {
    case 1:
      return query(collection(db, "products"), paramsArray[0], limit(10));
    case 2:
      return query(
        collection(db, "products"),
        paramsArray[0],
        paramsArray[1],
        limit(10)
      );
    case 3:
      return query(
        collection(db, "products"),
        paramsArray[0],
        paramsArray[1],
        paramsArray[2],
        limit(10)
      );
    case 4:
      return query(
        collection(db, "products"),
        paramsArray[0],
        paramsArray[1],
        paramsArray[2],
        paramsArray[3],
        limit(10)
      );
    default:
      return query(collection(db, "products"), limit(10));
  }
};
