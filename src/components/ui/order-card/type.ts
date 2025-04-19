import { Location } from 'react-router-dom';
import { TIngredient, TOrder } from '@utils-types';

export type OrderCardUIProps = {
  orderInfo: TOrderInfoExtended;
  maxIngredients: number;
  locationState: { background: Location };
};

export type TOrderInfoExtended = TOrder & {
  ingredientsInfo: TIngredient[];
  ingredientsToShow: TIngredient[];
  remains: number;
  total: number;
  date: Date;
};
