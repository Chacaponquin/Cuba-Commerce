export const signUpErrors = {
  noCoincidePassword: "No coinciden tus contraseñas",
  passwordCorta: "Su contraseña debe tener mas de 6 caracteres",
  requestError: "Hubo un error",
  emailRepetido: "Ya existe este usuario",
};

export const signInErrors = {
  wrongPassword: "Contraseña incorrecta",
  requestError: "Hubo un error",
  userNotFound: "Usuario no encontrado",
};

export const addProductErrors = {
  requestError: "Hubo un error",
  nameToLong: "Nombre del producto demasiado largo",
  descriptionLong: "La descripcion del producto es demasiado larga",
  categoryLong: "El nombre de la categoria es demasiado larga",
  categoryToMoch: "Solo se pueden insertar hasta 10 categorias",
  imagesToMoch: "Solo se pueden insertar hasta 6 imagenes",
  noImages: "Debe insertar alguna imagen",
  noCategories: "Debe tener al menos una categoria",
  priceToMoch: "El precio es demasiado grande",
  imageToBig: "La imagen no puede pesar mas de 10mb",
};

export const myProfileErrors = {
  requestError: "Hubo un error",
  nicknameLong: "Tu nuevo nickname es demasiado largo",
  descritptionLong: "Tu nueva descripcion es muy larga",
};
