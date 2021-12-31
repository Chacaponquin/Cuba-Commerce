import { BsX } from "react-icons/bs";

const AllProduct = (): JSX.Element => {
  return (
    <div className="allProducts-section">
      <h1>All Products</h1>

      <div className="myProfile-allProducts">
        <div className="myProfile-product">
          <img src="./product.jpg" alt="" />
          <p>Audiofonos G-3</p>

          <div className="eliminate-button">
            <p>Eliminar</p>
            <BsX size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProduct;
