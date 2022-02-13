import { Bars } from "@agney/react-loading";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { NavBar } from "../../components";
import { db } from "../../firebase/client";
import "./product.css";

const Product = (): JSX.Element => {
  //EXTRAER EL ID DEL PRODUCTO DE LA RUTA
  const { productID } = useParams();
  //STATE CON EL PRODUCTO ENCONTRADO
  const [productFound, setProductFound] = useState<any | null>(null);
  //STATE CON TODAS LAS IMAGENES DEL PRODUCTO
  const [allImages, setAllImages] = useState<string[]>([]);
  //STATE DE LOADING
  const [loading, setLoading] = useState<boolean>(false);
  //REFERENCIA DEL CONTADOR
  const cont = useRef<number>(0);
  //STATE DE LA URL DE LA IMAGEN SELECCIONADA
  const [selectImage, setSelectImage] = useState<string>("");

  //USEEFFECT PARA OBTENCION DEL PRODUCTO A PARTIR DEL ID
  useEffect(() => {
    //CAMBIAR LOADING A TRUE
    setLoading(true);

    //CREAR LA QUERY DEL PRODUCTO A BUSCAR
    const productQuery = query(
      collection(db, "products"),
      where("id", "==", productID)
    );

    getDocs(productQuery)
      .then(async (querySnapshot) => {
        let productFound: any;
        querySnapshot.forEach((product) => {
          productFound = product.data();
        });

        //INTRODUCIR LOS DATOS EN LOS STATES
        setProductFound(productFound);
        setAllImages(productFound.images);
        setSelectImage(productFound.images[0]);

        //CONSTRUIR LA QUERY DEL PERFIL DEL CREADOR DEL PRODUCTO
        const profileQuery = query(
          collection(db, "users"),
          where("id", "==", productFound.creatorID)
        );

        //OBTENER LA INFORMACION DEL USUARIO
        const profileFound = await getDocs(profileQuery);
        profileFound.forEach((profile) => {
          const data = profile.data();
          //INSERTAR EN EL STATE DEL PRODUCTO ENCONTRADO LA IMAGEN Y NOMBRE DEL CREADOR
          setProductFound({
            ...productFound,
            creatorID: { image: data.image, name: data.nickname },
          });
        });
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, [productID]);

  //USEEFFECT PARA CAMBIAR AUTOMATICAMENTE LAS FOTOS
  useEffect(() => {
    if (allImages.length) {
      setInterval(() => {
        cont.current =
          cont.current === allImages.length - 1 ? 0 : cont.current + 1;
        setSelectImage(allImages[cont.current]);
      }, 7000);
    }
  }, [allImages]);

  //SI SE ESTA CARGANDO LA PETICION MUESTRA EL LOADING
  if (loading) {
    return (
      <div className="product-loading">
        <Bars />
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <div className="product-container">
        <div className="product-header">
          <div className="product-header-inf">
            <h1>{productFound?.name}</h1>
            <p>${productFound?.price}</p>
          </div>

          <img src={selectImage} alt={productFound?.name} />

          <div className="product-header-creator">
            <h1>{productFound?.creatorID.name}</h1>
            <img
              src={productFound?.creatorID.image}
              alt={productFound?.creatorID.name}
            />
          </div>
        </div>

        <div className="product-images">
          {allImages.map((image: string, i: number) => (
            <img
              key={i}
              className={`product-image ${
                selectImage === image ? "image-select" : ""
              }`}
              src={image}
              alt=""
              onClick={() => {
                cont.current = i - 1;
                setSelectImage(image);
              }}
            />
          ))}
        </div>

        <div className="product-inf-section">
          <section className="section-label">
            <h1>Categories</h1>
          </section>
          <div className="product-categories">
            {productFound?.categories.map((category: string, i: number) => (
              <div key={i}>#{category}</div>
            ))}
          </div>

          <section className="section-label">
            <h1>Description</h1>
          </section>
          <div className="product-description">
            <p>{productFound?.description}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;
