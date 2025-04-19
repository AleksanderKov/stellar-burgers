import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';

import { useDispatch } from '../../services/store';
import { addIngredient } from '../../services/slices/constructorSlice';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient: data, count: addedCount }) => {
    const currentLocation = useLocation();
    const dispatch = useDispatch();

    const handleClickAddIngredient = () => {
      dispatch(addIngredient(data));
    };

    return (
      <BurgerIngredientUI
        ingredient={data}
        count={addedCount}
        locationState={{ background: currentLocation }}
        handleAdd={handleClickAddIngredient}
      />
    );
  }
);
