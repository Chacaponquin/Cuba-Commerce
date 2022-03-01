import { Dispatch, useEffect, useRef, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { BsX } from "react-icons/bs";
import { FaImages } from "react-icons/fa";
import { useFileUpload } from "use-file-upload";
import { Error, NavBar } from "../../components";
import { db, storage } from "../../firebase/client";
import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { addProductErrors, mostrarError } from "../../helpers/errors";
import { AddProductData } from "../../helpers/types";
import { validationAddProduct } from "../../helpers/validations";
import "./addProduct.css";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Bars, useLoading } from "@agney/react-loading";
import { useNavigate } from "react-router";
import { ProfileContext } from "../../context/ProfileContext";
import { validateImage } from "../../helpers/validateImage";

const AddProduct = (): JSX.Element => {
  //EXTRAER CONTEXT
  const { user } = useContext(ProfileContext);
  const navigate = useNavigate();
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

  //FUNCION PARA ELIMINAR CATEGORIA DEL STATE DE CATEGORIAS
  const deleteCategory = (e: any): any => {
    const newCategories = categories.filter(
      (category: string) => category !== e.target.id
    );

    setCategories(newCategories);
  };

  //FUNCION PARA PERMITIR AL USUARIO SELECCIONAR IMAGENES
  const selectImage = (): void => {
    selectFile({ multiple: true, accept: "image/*" }, (file: any): void => {
      let contError = 0;
      let i = 0;
      while (contError === 0 && i < file.length) {
        if (!validateImage(file[i])) contError++;
        i++;
      }

      contError === 0
        ? setImages(file)
        : mostrarError(addProductErrors.imageToBig, setFormError);
    });
  };

  const onSubmit = async (data: AddProductData) => {
    //INSTRODUCIR LAS CATEGORIAS Y LAS IMAGENES EN EL FORMULARIO
    if (user) {
      data.categories = categories;
      data.price = Number(data.price);
      data.images = images;
      data.visits = 0;
      data.creatorID = user.uid;
      data.id = `${user.uid}${Date.now()}`;
      data.sold = false;
    }

    //VERIFICAR SI EXISTE ALGUN ERROR EN EL FORMULARIO
    const error: null | string = validationAddProduct(data);

    data.images = [];

    if (error) mostrarError(error, setFormError);
    else {
      //CAMBIAR EL STATE DE LOADING A TRUE
      setLoading(true);

      //CREAR LA REFERENCIA DONDE SE UBICAN LOS PRODUCTOS EN FIREBASE
      const collectionRef = doc(db, "products", data.id);

      //SE REALIZA UN BUCLE PARA CADA ELEMENTO DEL ARRAY DE LAS CATEGORIAS
      for (let i = 0; i < data.categories.length; i++) {
        //CREAR LA REFERENCIA DONDE SE UBICAN LAS CATEGORIAS EN FIREBASE
        const categoriesRef = doc(db, "categories", data.categories[i]);

        //CREAR EL OBJETO QUE SE VA A SUBIR CON LA NUEVA CATEGORIA
        const newCategory = { category: data.categories[i] };

        //SUBIR LA NUEVA CATEGORIA
        await setDoc(categoriesRef, newCategory);
      }

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

          //REDIRECCIONAR AL HOME
          navigate("/");
        })
        .catch((error) =>
          mostrarError(addProductErrors.requestError, setFormError)
        )
        .finally(() => setLoading(false));
    }
  };

  return (
    <>
      {loading && (
        <div
          className="addProduct-loading"
          {...containerProps}
          style={{ height: `${window.innerHeight}px` }}
        >
          <Bars />
        </div>
      )}

      <NavBar />

      {formError && (
        <Error
          error={formError}
          position="right-error-position"
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
              setCategories={setCategories}
              deleteCategory={deleteCategory}
              categories={categories}
            />

            <button className="createProduct-button">Create Product</button>
          </form>
        </div>
      </div>
    </>
  );
};

//INTERFACE DE LOS PROPS DEL COMPONENTE CATEGORYINPUTPROPS
interface CategoryInputProps {
  categories: string[];
  setCategories: Dispatch<string[]>;
  deleteCategory(e: any): any;
  categoryInputRef: any;
}

const CategoryInputSection = ({
  setCategories,
  deleteCategory,
  categories,
  categoryInputRef,
}: CategoryInputProps): JSX.Element => {
  //STATE DE LA ALTURA DE EL CONTENEDOR DE TODAS LAS CATEGORIAS ENCONTRADAS
  const [resultHeight, setResultHeight] = useState(
    document.querySelector(".category-search-result")?.clientHeight
  );
  //STATE CON EL VALOR DEL INPUT DE CATEGORIAS
  const [inputSearch, setInputSearch] = useState<string>("");
  //STATE CON TODAS LAS CATEGORIAS ENCONTRADAS
  const [categoriesFound, setCategoriesFound] = useState<any[]>([]);

  //FUNCION PARA BUSCAR CATEGORIAS RELACIONADAS
  const handleCategoryChange = (e: any) => {
    //INSERTAR EN EL STATE EL VALOR DEL INPUT
    setInputSearch(e.target.value);
    //CREAR LA QUERY DE TODAS LAS CATEGORIAS
    const categoryQuery = query(collection(db, "categories"), limit(10));

    let allCategories: any[] = [];
    getDocs(categoryQuery)
      .then((querySnapshot) => {
        querySnapshot.forEach((category) => {
          allCategories.push(category.data());
        });
        //FILTRAR LAS CATEGORIAS
        const categoryIncludes = allCategories.filter((category) =>
          category.category.toLowerCase().includes(inputSearch.toLowerCase())
        );

        setCategoriesFound(categoryIncludes);
      })
      .catch((error) => console.log(error));
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

      if (categoryInputRef.current) setInputSearch("");

      //VACIAR EL BLOQUE DE CATEGORIAS SIMILARES
      setCategoriesFound([]);
    } else {
      if (categoryInputRef.current) categoryInputRef.current.value = "";
    }
  };

  //USEEFFECT PARA CAMBIAR EL TAMAÑO DEL CONTENEDOR DE CATEGORIAS
  useEffect((): any => {
    setResultHeight(
      document.querySelector(".category-search-result")?.clientHeight
    );
  }, [categoriesFound]);

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
          {categoriesFound.map((category, i: number) => (
            <div
              key={i}
              onClick={() => {
                setCategoriesFound([]);
                setInputSearch(category.category);
              }}
            >
              {category.category}
            </div>
          ))}
        </div>

        <input
          type="text"
          className="categories-form-search"
          ref={categoryInputRef}
          onChange={handleCategoryChange}
          value={inputSearch}
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
