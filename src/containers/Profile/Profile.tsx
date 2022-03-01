import { useState, useEffect, useContext } from "react";
import { FaCheck, FaPlus } from "react-icons/fa";
import { useNavigate, useParams } from "react-router";
import { NavBar, ProfileLoading } from "../../components";
import { db } from "../../firebase/client";
import { AddProductData } from "../../helpers/types";
import { Error } from "../../components";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { mostrarError, profileErrors } from "../../helpers/errors";
import "./profile.css";
import { ProfileContext } from "../../context/ProfileContext";

const Profile = (): JSX.Element => {
  //EXTRAER EL ID DEL USUARIO DE LA RUTA
  const { id } = useParams();
  //EXTRAER CONTEXT DE USER
  const { user } = useContext(ProfileContext);
  const navigate = useNavigate();
  //STATE PARA SABER SI SE SIGUE AL USUARIO
  const [follow, setFollow] = useState<boolean>(false);
  //STATE DEL LOADING CUANDO SE ESTAN OBTENIENDO LOS PRODUCTOS
  const [productLoading, setProductLoading] = useState<boolean>(false);
  //STATE DE ERROR
  const [error, setError] = useState<null | string>(null);
  //STATE CON LA INFORMACION DEL USUARIO
  const [profileInf, setProfileInf] = useState<null | any>(null);
  const [profileProducts, setProfileProducts] = useState<any[]>([]);

  //FUNCION PARA SEGUIR AL USUARIO
  const handleDecideFollow = async () => {
    if (id && user) {
      updateDoc(doc(db, "users", id), {
        followers: follow ? arrayRemove(user.uid) : arrayUnion(user.uid),
      })
        .then(() => {
          if (user.uid) {
            updateDoc(doc(db, "users", user.uid), {
              following: follow ? arrayRemove(id) : arrayUnion(id),
            });

            setFollow(!follow);
          }
        })
        .catch((error) => mostrarError(profileErrors.requestError, setError));
    }
  };

  useEffect(() => {
    //SI NO EXISTE ID EN LA RUTA SE REDIRECCIONA A ERROR 404
    if (!id) navigate("/notFound");
    else {
      //CREAR LA QUERY DEL USUARIO
      const profileQuery = query(
        collection(db, "users"),
        where("id", "==", id)
      );
      //OBTENER LOS DATOS DEL PERFIL
      getDocs(profileQuery).then((querySnapshot) => {
        querySnapshot.forEach((profile) => {
          const profileFound = profile.data();
          setProfileInf(profileFound);

          //VERIFICAR SI SE SIGUE AL USUARIO
          const checkFollow = profileFound.followers.find(
            (el: string) => el === user.uid
          );
          if (checkFollow) setFollow(true);
        });
      });

      //CAMBIAR EL STATE DE LOADING A TRUE
      setProductLoading(true);
      //CREAR LA QUERY DE LOS PRODUCTOS DEL USUARIO
      const productsQuery = query(
        collection(db, "products"),
        where("creatorID", "==", id)
      );

      //OBTENER TODOS LOS PRODUCTOS
      let allProducts: any[] = [];
      getDocs(productsQuery)
        .then((querySnapshot) => {
          querySnapshot.forEach((product) => allProducts.push(product.data()));

          setProfileProducts(allProducts);
        })
        .catch((error) => console.log(error))
        .finally(() => setProductLoading(false));
    }
  }, [id, navigate, user]);

  return (
    <>
      <NavBar />
      <div className="profile-container">
        {error && (
          <Error
            error={error}
            setFormError={setError}
            position="right-error-position"
          />
        )}

        <div className="profile-header">
          <section className="profile-header-left">
            <img src={profileInf?.image} alt={profileInf?.nickname} />
            <p>{profileInf?.nickname}</p>
          </section>

          <section className="profile-header-right">
            <button
              onClick={handleDecideFollow}
              className={`${follow ? "follow-check" : "follow-uncheck"}`}
            >
              {follow ? <FaCheck size={20} /> : <FaPlus size={25} />}
              Follow
            </button>
          </section>
        </div>

        <div className="profile-products">
          <h1>All Products</h1>
          {productLoading ? (
            <ProfileLoading />
          ) : (
            <ProfileProducts products={profileProducts} />
          )}
        </div>
      </div>
    </>
  );
};

interface ProfileProductsProps {
  products: any[];
}

const ProfileProducts = ({ products }: ProfileProductsProps): JSX.Element => {
  return (
    <section className="profile-allProducts">
      {products.map((product: AddProductData, i: number) => (
        <div key={i} style={{ backgroundImage: `url(${product?.images[0]})` }}>
          <h1>${product?.price}</h1>
        </div>
      ))}
    </section>
  );
};

export default Profile;
