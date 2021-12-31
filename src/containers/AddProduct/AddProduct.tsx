import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { BsX } from "react-icons/bs";
import { FaImages } from "react-icons/fa";
import { useFileUpload } from "use-file-upload";
import { Error, NavBar } from "../../components";
import { db, storage } from "../../firebase/client";
import { doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { addProductErrors } from "../../helpers/errors";
import { AddProductData } from "../../helpers/types";
import { validationAddProduct } from "../../helpers/validations";
import "./addProduct.css";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Bars, useLoading } from "@agney/react-loading";

const AddProduct = (): JSX.Element => {
  const isMount = useRef<boolean>(true);

  const { containerProps } = useLoading({ loading: true, indicator: <Bars /> });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  //REF CON EL INPUT DE LA CATEGORIA DEL PRODUCTO
  const categoryInputRef = useRef<HTMLInputElement>(null);

  //STATE CON LAS CATEGORIAS ESCRITAS
  const [categories, setCategories] = useState<string[]>([]);

  //STATE DEL LOADING
  const [loading, setLoading] = useState<boolean>(false);

  //STATE DE LAS IMAGENES SUBIDAS
  const [file, selectFile] = useFileUpload();

  //DEBIDO A QUE NO TENGO EL PROTOTIPO DE LA VARIABLE FILE DE LA LIBRERIA EN ESTE STATE SE GUARDA EL OBJETO FILE
  const [images, setImages] = useState<any[]>([]);

  //STATE QUE CONTIENE EL POSIBLE ERROR EN EL FORMULARIO
  const [formError, setFormError] = useState<null | string>(null);

  //FUNCION PARA MOSTRAR EL ERROR AL USUARIO
  const mostrarError = (error: string) => {
    setFormError(error);
    setTimeout(() => setFormError(null), 8000);
  };

  //FUNCION PARA AÑADIR CATEGORIA AL STATE DE CATEGORIAS
  const addCategory = (): any => {
    const input = categoryInputRef.current?.value;

    if (
      input !== undefined &&
      input !== "" &&
      !categories.find((category: string) => category === input.toLowerCase())
    ) {
      setCategories([...categories, input.toLowerCase()]);

      if (categoryInputRef.current) categoryInputRef.current.value = "";
    } else {
      if (categoryInputRef.current) categoryInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: AddProductData) => {
    //INSTRODUCIR LAS CATEGORIAS Y LAS IMAGENES EN EL FORMULARIO
    data.categories = categories;
    data.price = Number(data.price);
    data.images = images;
    data.visits = 0;

    const error: null | string = validationAddProduct(data);

    data.images = [];

    if (error) mostrarError(error);
    else {
      //CAMBIAR EL STATE DE LOADING A TRUE
      setLoading(true);

      const collectionRef = doc(db, "products", data.name);
      setDoc(collectionRef, { ...data, timestamp: serverTimestamp() })
        .then(async () => {
          for (let i = 0; i < images.length; i++) {
            //REFERENCIA Y DIRECCION DE LA IMAGEN
            const imageRef = ref(
              storage,
              `images/products/${data.name}${Date.now()}${i}`
            );
            //SUBIR LA IMAGEN
            const productImage = await uploadBytes(imageRef, images[i].file);
            //OBTENER LA URL DE LA IMAGEN SUBIDA
            const imageURL = await getDownloadURL(productImage.ref);

            //SUMAR LA URL A LA LISTA DE IMAGENES DEL PRODUCTO
            data.images = [...data.images, imageURL];
          }

          //ACTUALIZAR LOS DATOS DEL PRODUCTO CON LAS IMAGENES DESPUES QUE TERMINE EL CICLO
          await updateDoc(collectionRef, { images: data.images });
        })
        .catch((error) => mostrarError(addProductErrors.requestError))
        .finally(() => setLoading(false));
    }
  };

  //FUNCION PARA ELIMINAR CATEGORIA DEL STATE DE CATEGORIAS
  const deleteCategory = (e: any): any => {
    const newCategories = categories.filter(
      (category: string) => category !== e.target.id
    );

    setCategories(newCategories);
  };

  const selectImage = (): void => {
    selectFile({ multiple: true, accept: "image/*" }, (file: any): void => {
      if (file[0].size / 1048576 < 10) setImages(file);
      else mostrarError(addProductErrors.imageToBig);
    });
  };

  return (
    <>
      <NavBar />

      {formError && (
        <Error
          error={formError}
          position="addProduct-error-position"
          setFormError={setFormError}
        />
      )}

      <div className={`addProduct`}>
        {file ? (
          <div className="imagesSelected">
            {images.map((file: any, i: number) => (
              <img src={file.source} alt={file.name} key={i} />
            ))}

            <button onClick={selectImage}>
              <FaImages size={30} color="white" />
              <p>Añadir Imagenes</p>
            </button>
          </div>
        ) : (
          <div
            className={`addImageDiv  ${
              formError === addProductErrors.noImages ? "noImage-error" : ""
            }`}
            onClick={selectImage}
          >
            <FaImages size={50} />
            <p>Añadir Imagenes</p>
          </div>
        )}

        <div className="product-form">
          <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="">Nombre</label>
            <input
              type="text"
              autoComplete="off"
              spellCheck="false"
              {...register("name", { required: true })}
              className={errors.name ? "addProduct-form-error" : ""}
            />

            <label htmlFor="">Precio</label>
            <input
              type="number"
              {...register("price", { required: true })}
              className={errors.price ? "addProduct-form-error" : ""}
            />

            <label htmlFor="">Descripcion</label>
            <textarea
              spellCheck="false"
              rows={4}
              autoComplete="off"
              {...register("description", { required: true })}
              className={errors.description ? "addProduct-form-error" : ""}
            ></textarea>

            <CategoryInputSection
              categoryInputRef={categoryInputRef}
              addCategory={addCategory}
              deleteCategory={deleteCategory}
              categories={categories}
              isMount={isMount}
            />

            {loading ? (
              <div className="addProduct-loading" {...containerProps}>
                <Bars />
              </div>
            ) : (
              <button className="createProduct-button">Create Product</button>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

//INTERFACE DE LOS PROPS DEL COMPONENTE CATEGORYINPUTPROPS
interface CategoryInputProps {
  categories: string[];
  addCategory: any;
  deleteCategory: any;
  categoryInputRef: any;
  isMount: any;
}

const CategoryInputSection = ({
  categories,
  addCategory,
  deleteCategory,
  categoryInputRef,
  isMount,
}: CategoryInputProps): JSX.Element => {
  const [resultHeight, setResultHeight] = useState(
    document.querySelector(".category-search-result")?.clientHeight
  );

  useEffect((): any => {
    if (isMount.current) {
      setResultHeight(
        document.querySelector(".category-search-result")?.clientHeight
      );

      document
        .querySelector(".category-search-result")
        ?.addEventListener("change", () => {
          setResultHeight(
            document.querySelector(".category-search-result")?.clientHeight
          );
          console.log("Hola");
        });
    }

    return () => (isMount.current = false);
  }, []);

  return (
    <>
      <label htmlFor="">Categorias</label>
      <div>
        <div
          className="category-search-result"
          style={{
            transform: `translateY(-${resultHeight && resultHeight + 5}px)`,
          }}
        >
          <div>#hola</div>
          <div>#hola</div>
        </div>

        <input
          type="text"
          className="categories-form-search"
          ref={categoryInputRef}
        />
        <div onClick={addCategory}>New</div>
      </div>

      <div className="categories-blocks">
        {categories.map((category: string, i: number) => (
          <div id="category-form" key={i}>
            <p>#{category}</p>
            <BsX
              size={20}
              color="white"
              id={category}
              onClick={deleteCategory}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default AddProduct;
