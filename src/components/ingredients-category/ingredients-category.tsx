import { forwardRef, useMemo } from 'react';
import { useSelector } from '../../services/store';

import { TIngredientsCategoryProps } from './type';
import { TConstructorIngredient } from '@utils-types';

import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { selectConstructorState } from '../../services/slices/constructorSlice';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  const { bun, ingredients: addedIngredients } = useSelector(
    selectConstructorState
  ) as {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };

  const ingredientsCounters = useMemo(() => {
    const counters: Record<string, number> = {};

    addedIngredients.forEach((ingredient) => {
      counters[ingredient._id] = (counters[ingredient._id] || 0) + 1;
    });

    if (bun) {
      counters[bun._id] = 2;
    }

    return counters;
  }, [addedIngredients, bun]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
