import { isEditingOptions } from "../containers/MyProfile/MyProfile";
import { SignUpData, AddProductData } from "../helpers/types";
import { addProductErrors, myProfileErrors, signUpErrors } from "./errors";

export const validateSignUp = (form: SignUpData): string | null => {
  let error: null | string = null;

  if (form.confirmPassword !== form.password)
    error = signUpErrors.noCoincidePassword;
  else if (form.password.length < 6) error = signUpErrors.passwordCorta;

  return error;
};

export const validationAddProduct = (form: AddProductData): string | null => {
  let error = null;

  if (form.name.length > 35) error = addProductErrors.nameToLong;
  else if (form.description.length > 250)
    error = addProductErrors.descriptionLong;
  else if (form.categories.length > 10) error = addProductErrors.categoryToMoch;
  else if (form.images.length > 6) error = addProductErrors.imagesToMoch;
  else if (form.images.length === 0) error = addProductErrors.noImages;
  else if (form.categories.length === 0) error = addProductErrors.noCategories;
  else if (form.price > 999999) error = addProductErrors.priceToMoch;

  return error;
};

export const validationMyProfile = (
  input: string,
  inputField: string
): null | string => {
  let error = null;

  if (inputField === isEditingOptions.nickname) {
    if (input.length > 35) error = myProfileErrors.nicknameLong;
  } else {
    if (input.length > 200) error = myProfileErrors.descritptionLong;
  }

  return error;
};
