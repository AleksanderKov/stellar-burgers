import { FC, memo } from 'react';
import { useDispatch } from '../../services/store';

import {
  deleteIngredient,
  moveIngredient
} from '../../services/slices/constructorSlice';

import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    const handleMoveDown = () => {
      dispatch(moveIngredient({ fromIndex: index, shift: -1 }));
    };

    const handleMoveUp = () => {
      dispatch(moveIngredient({ fromIndex: index, shift: +1 }));
    };

    const handleRemove = () => {
      dispatch(deleteIngredient(ingredient));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleRemove}
      />
    );
  }
);
