export type SignInData = {
  email: string;
  password: string;
};

export type SignUpData = {
  nickname: string;
  password: string;
  confirmPassword: string;
  email: string;
  image?: any;
};

export type AddProductData = {
  name: string;
  price: number;
  description: string;
  categories: string[];
  images: any[];
  visits: number;
};
