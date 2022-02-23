import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  HomeCategories,
  HomeFriends,
  HomePosts,
  NavBar,
} from "../../components";
import { db } from "../../firebase/client";
import "./home.css";

const Home = (): JSX.Element => {
  //STATE PARA LOS POSTS BUSCADOS
  const [homePosts, setHomePosts] = useState<any[]>([]);
  //STATE DEL LOADING
  const [loading, setLoading] = useState<boolean>(true);
  //STATE DE LAS CATEGORIAS ENCONTRADAS DE INICIO
  const [bestCategories, setBestCategories] = useState<any[]>([]);
  //STATE DE LA POSIBLE CATEGORIA SELECCIONADA
  const [selectCategory, setSelectCategory] = useState<null | string>(null);
  //STATE DEL POSIBLE ERROR

  useEffect(() => {
    //CAMBIAR EL STATE DE LOADING A TRUE
    setLoading(true);

    //QUERY INICIAL POR DEFECTO
    let initialQuery = query(
      collection(db, "products"),
      limit(20),
      orderBy("timestamp", "desc")
    );

    //SI EXISTE UNA CATEGORIA SELECCIONADA SE REALIZA LA BUSQUEDA DE PRODUCTOS QUE CONTENGAN ESA CATEGORIA
    if (selectCategory) {
      initialQuery = query(
        collection(db, "products"),
        limit(20),
        orderBy("timestamp", "desc"),
        where("categories", "array-contains", selectCategory)
      );
    }

    //OBTENER TODOS LOS PRODUCTOS DE FIREBASE
    onSnapshot(
      initialQuery,
      async (querySnapshot) => {
        //ARRAY CON TODOS LOS PRODUCTOS ENCONTRADOS
        let allProducts: any[] = [];
        querySnapshot.forEach((product) => {
          allProducts.push(product.data());
        });

        //UN BUCLE PARA OBTENER LOS DATOS DE LOS CREADORES DE CADA PRODUCTO
        for (let i = 0; i < allProducts.length; i++) {
          //CREAR LA QUERY DEL ID
          const querySend = query(
            collection(db, "users"),
            where("id", "==", allProducts[i].creatorID)
          );

          //HACER LA PETICION DE BUSCAR ENTRE LOS PERFILES UN ID IGUAL AL CREADOR DEL PRODUCTO
          const usersFound = await getDocs(querySend);

          //ARRAY CON TODOS LOS USUARIOS ENCONTRADOS
          let allUsers: any[] = [];
          usersFound.forEach((user) => (allUsers = [...allUsers, user.data()]));

          //SI EXISTE AL MENOS UN SOLO USUARIO ENCONTRADO GUARDAR LOS DATOS
          if (allUsers.length) {
            allProducts[i].creatorID = {
              nickname: allUsers[0].nickname,
            };

            //SI EL USUARIO TIENE IMAGEN SE GUARDA
            if (allUsers[0].image) {
              allProducts[i].creatorID.image = allUsers[0].image;
            }
          }
        }

        //INSERTAR TODOS LOS DATOS ACTUALIZADOS EN EL STATE DE TODOS LOS PRODUCTOS
        setHomePosts(allProducts);
      },
      (error) => {
        console.log(error);
      }
    );

    setLoading(false);
  }, [selectCategory]);

  return (
    <div className="home-container">
      <NavBar />

      {!homePosts.length && !loading ? (
        <div className="no-connection-svg">
          <img src="./svg/no-connection.svg" alt="Hola" />
          <h1>No estas conectado</h1>
        </div>
      ) : (
        <div className="home-principal">
          <HomeCategories
            bestCategories={bestCategories}
            selectCategory={selectCategory}
            setBestCategories={setBestCategories}
            setSelectCategory={setSelectCategory}
          />
          <HomePosts
            posts={homePosts}
            loading={loading}
            setSelectCategory={setSelectCategory}
            selectCategory={selectCategory}
          />
          <HomeFriends />
        </div>
      )}
    </div>
  );
};

export default Home;
