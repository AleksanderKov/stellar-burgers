import { FC } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';

import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';

import { selectIngredients } from '../../services/slices/ingredientSlice';

import styles from './ingredient-details.module.css';

export const IngredientDetails: FC = () => {
  const { id: ingredientId } = useParams<{ id?: string }>();
  const location = useLocation();
  const isModal = !!location.state?.background;

  const allIngredients = useSelector(selectIngredients);
  const selectedIngredient = allIngredients.find(
    (item) => item._id === ingredientId
  );

  if (!selectedIngredient) return <Preloader />;

  return (
    <div className={!isModal ? styles.wrapper : ''}>
      {!isModal && <h1 className={styles.title}>Детали ингредиента</h1>}
      <IngredientDetailsUI ingredientData={selectedIngredient} />
    </div>
  );
};
