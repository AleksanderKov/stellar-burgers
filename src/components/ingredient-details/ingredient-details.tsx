import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';

import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';

import { selectIngredients } from '../../services/slices/ingredientSlice';

export const IngredientDetails: FC = () => {
  const { id: ingredientId } = useParams<{ id?: string }>();

  const allIngredients = useSelector(selectIngredients);

  const selectedIngredient = allIngredients.find(
    (item) => item._id === ingredientId
  );

  if (!selectedIngredient) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={selectedIngredient} />;
};
