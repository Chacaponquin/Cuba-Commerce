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
  id: string;
  name: string;
  price: number;
  description: string;
  categories: string[];
  images: any[];
  visits: number;
  creatorID: string;
  sold: boolean;
};

export type UsersInfo = {
  followers: string[];
  following: string[];
  image?: string | null;
  id: string;
  nickname: string;
  messages: string[];
};

export type SearchParams = {
  category?: string;
  priceMin?: number;
  priceMax?: number;
  zona?: string;
  order?: string;
  name?: string;
};

export type MessageData = {
  id: string;
  profileTo: string;
  message: string;
  messageNotification: string;
  profileOwner: string;
};
