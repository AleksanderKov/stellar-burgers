export type TIngredientType = 'bun' | 'sauce' | 'main' | 'top' | 'bottom';

export type TIngredient = {
  _id: string;
  name: string;
  type: TIngredientType;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
};

export type TConstructorIngredient = TIngredient & {
  id: string;
};

export type TOrderStatus = 'created' | 'pending' | 'done' | 'ready';

export type TOrder = {
  _id: string;
  status: TOrderStatus;
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
  ingredients: string[];
};

export type TOrderInfoExtended = TOrder & {
  ingredientsInfo: Record<string, TIngredient & { count: number }>;
  total: number;
  date: Date;
};

export type TOrdersData = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

export type TUser = {
  email: string;
  name: string;
};

export type TTabMode = 'bun' | 'sauce' | 'main';
