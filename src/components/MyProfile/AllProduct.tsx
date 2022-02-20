import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { BsX } from "react-icons/bs";
import { FaCheck } from "react-icons/fa";
import { ProfileLoading } from "..";
import { db } from "../../firebase/client";
import { AddProductData } from "../../helpers/types";

interface AllProdcuts {
  id: string | undefined;
  handleDeleteProduct(id: string): any;
}

const AllProduct = ({ id, handleDeleteProduct }: AllProdcuts): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(false);
  const [allProducts, setAllProducts] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    const qy = query(collection(db, "products"), where("creatorID", "==", id));

    let productsFound: any[] = [];
    getDocs(qy)
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
                  <button>
                    Sold
                    <FaCheck />
                  </button>
                  <button onClick={handleDeleteProduct(product.id)}>
                    Eliminar
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
