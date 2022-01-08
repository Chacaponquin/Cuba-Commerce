import { collection, getDocs, limit, query, where } from "firebase/firestore";
import React, { useEffect, Dispatch } from "react";
import { db } from "../../firebase/client";

interface HomeCategoriesProps {
  bestCategories: any[];
  selectCategory: null | string;
  setBestCategories: Dispatch<any[]>;
  setSelectCategory: Dispatch<null | string>;
}

const HomeCategories = ({
  bestCategories,
  selectCategory,
  setBestCategories,
  setSelectCategory,
}: HomeCategoriesProps): JSX.Element => {
  useEffect(() => {
    let querySend = query(collection(db, "categories"), limit(15));
    //OBTENER LAS CATEGORIAS DE LA COLECCION DE FIREBASE
    getDocs(querySend)
      .then(async (querySnapshot) => {
        //ANADIR A UN ARRAY TODAS LAS CATEGORIAS RECIBIDAS
        let allCategoories: any[] = [];
        querySnapshot.forEach((category) => {
          allCategoories.push(category.data());
        });

        //UN BUCLE PARA BUSCAR POR CADA CATEGORIA LA CANTIDAD DE POSTS QUE TIENEN
        for (let i = 0; i < allCategoories.length; i++) {
          //CREAR LA QUERY PARA BUSCAR
          const querySend = query(
            collection(db, "products"),
            where("categories", "array-contains", allCategoories[i].category)
          );

          //ANADIR EN UN ARRAY TODOS LOS POSTS QUE ENCUENTRA CON ESA CATEGORIA
          let allPosts: any[] = [];
          const postsFound = await getDocs(querySend);
          postsFound.forEach((post) => {
            allPosts.push(post.data());
          });

          //EN LA CATEGORIA PONER LA CANTIDAD DE POSTS ENCONTRADOS
          allCategoories[i].posts = allPosts.length;
        }
        //PONER EN EL STATE TODAS LAS CATEORIAS CON LOS DATOS ACTUALIZADOS
        setBestCategories(allCategoories);
      })
      .catch((error) => console.log(error.status));
  }, []);

  return (
    <div className="categories-container">
      {bestCategories &&
        bestCategories.map((category, i: number) => (
          <div
            className={`category ${
              selectCategory === category.category ? "category-select" : ""
            }`}
            key={i}
            onClick={() => setSelectCategory(category.category)}
          >
            <p>#{category.category}</p>
            <p>{category.posts}</p>
          </div>
        ))}
    </div>
  );
};

export default HomeCategories;
