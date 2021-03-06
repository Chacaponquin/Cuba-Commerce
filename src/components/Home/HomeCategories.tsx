import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useEffect, Dispatch } from "react";
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
    onSnapshot(
      querySend,
      async (querySnapshot) => {
        //ANADIR A UN ARRAY TODAS LAS CATEGORIAS RECIBIDAS
        let allCategories: any[] = [];
        querySnapshot.forEach((category) => {
          allCategories.push(category.data());
        });

        //UN BUCLE PARA BUSCAR POR CADA CATEGORIA LA CANTIDAD DE POSTS QUE TIENEN
        for (let i = 0; i < allCategories.length; i++) {
          //CREAR LA QUERY PARA BUSCAR
          const querySend = query(
            collection(db, "products"),
            where("categories", "array-contains", allCategories[i].category)
          );

          //ANADIR EN UN ARRAY TODOS LOS POSTS QUE ENCUENTRA CON ESA CATEGORIA
          let allPosts: any[] = [];
          const postsFound = await getDocs(querySend);
          postsFound.forEach((post) => {
            allPosts.push(post.data());
          });

          //EN LA CATEGORIA PONER LA CANTIDAD DE POSTS ENCONTRADOS
          allCategories[i].posts = allPosts.length;
        }

        //ORGANIZARLOS DE FORMA DESCENDENTE
        allCategories.sort((a, b) => a.posts - b.posts).reverse();

        //PONER EN EL STATE TODAS LAS CATEORIAS CON LOS DATOS ACTUALIZADOS
        setBestCategories(allCategories);
      },
      (error) => {
        console.log(error);
      }
    );
  }, [setBestCategories]);

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
