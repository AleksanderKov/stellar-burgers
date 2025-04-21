import { TOrder, TIngredient } from '@utils-types';

export type OrderCardProps = {
  order: TOrder;
};

export type TOrderInfoExtended = TOrder & {
  ingredientsInfo: TIngredient[];
  ingredientsToShow: TIngredient[];
  remains: number;
  total: number;
  date: Date;
};
