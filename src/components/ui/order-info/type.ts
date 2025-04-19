import { TIngredient, TOrder } from '@utils-types';

export type TOrderInfoExtended = TOrder & {
  ingredientsInfo: {
    [ingredientId: string]: TIngredient & { count: number };
  };
  total: number;
  date: Date;
};

export type OrderInfoUIProps = {
  orderInfo: TOrderInfoExtended;
};
