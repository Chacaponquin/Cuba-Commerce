import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState, Dispatch } from "react";
import { BsX } from "react-icons/bs";
import { FaCheck } from "react-icons/fa";
import { ProfileLoading } from "..";
import { db } from "../../firebase/client";
import { AddProductData } from "../../helpers/types";

interface AllProdcutsProps {
  id: string | undefined;
  handleDeleteProduct(
    id: string,
    setAllProducts: Dispatch<any[]>,
    allProducts: any[]
  ): any;
  handleSoldProduct(
    id: string,
    allProducts: any[],
    setAllProducts: Dispatch<any[]>
  ): any;
}

const AllProduct = ({
  id,
  handleDeleteProduct,
  handleSoldProduct,
}: AllProdcutsProps): JSX.Element => {
  //STATE DE LOADING
  const [loading, setLoading] = useState<boolean>(false);
  //STATE DE TODOS LOS PRODUCTOS
  const [allProducts, setAllProducts] = useState<any[]>([]);

  //USEEFFECT PARA LA BUSQUEDA DE TODOS LOS PRODUCTOS
  useEffect(() => {
    //CAMBIAR EL STATE DE LOADING A TRUE
    setLoading(true);
    //CREAR LA QUERY DE LOS PRODUCTOS A BUSCAR
    const productsQuery = query(
      collection(db, "products"),
      where("creatorID", "==", id)
    );

    //BUSCAR Y GUARDAR LOS PRODUCTOS
    let productsFound: any[] = [];
    getDocs(productsQuery)
      .then((querySnapshot) => {
        querySnapshot.forEach((product) => {
          productsFound.push(product.data());
        });

        setAllProducts(productsFound);
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="allProducts-section">
      <h1>All Products</h1>

      {loading ? (
        <ProfileLoading />
      ) : (
        <div className="myProfile-allProducts">
          {allProducts.length ? (
            allProducts.map((product: AddProductData, i: number) => (
              <div className="myProfile-product" key={i}>
                <img src={product.images[0]} alt={product.name} />
                <p>{product.name}</p>

                <div className="myProfile-product-buttons">
                  <button
                    className={product.sold ? "sold" : ""}
                    onClick={() =>
                      handleSoldProduct(product.id, allProducts, setAllProducts)
                    }
                  >
                    Sold
                    <FaCheck />
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteProduct(
                        product.id,
                        setAllProducts,
                        allProducts
                      )
                    }
                  >
                    Delete
                    <BsX />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <h1>No tienes productos</h1>
          )}
        </div>
      )}
    </div>
  );
};

export default AllProduct;
