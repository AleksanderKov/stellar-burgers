import { FC, useState, useRef, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { useSelector } from '../../services/store';
import { selectIngredients } from '../../services/slices/ingredientSlice';

import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { TIngredient, TTabMode } from '@utils-types';

export const BurgerIngredients: FC = () => {
  const allIngredients = useSelector(selectIngredients);

  const bunItems = allIngredients.filter((item) => item.type === 'bun');
  const mainItems = allIngredients.filter((item) => item.type === 'main');
  const sauceItems = allIngredients.filter((item) => item.type === 'sauce');

  const [activeCategory, setActiveCategory] = useState<TTabMode>('bun');

  const sectionBunRef = useRef<HTMLHeadingElement>(null);
  const sectionMainRef = useRef<HTMLHeadingElement>(null);
  const sectionSauceRef = useRef<HTMLHeadingElement>(null);

  const [bunObserverRef, isInViewBun] = useInView({ threshold: 0 });
  const [mainObserverRef, isInViewMain] = useInView({ threshold: 0 });
  const [sauceObserverRef, isInViewSauce] = useInView({ threshold: 0 });

  useEffect(() => {
    if (isInViewBun) setActiveCategory('bun');
    else if (isInViewSauce) setActiveCategory('sauce');
    else if (isInViewMain) setActiveCategory('main');
  }, [isInViewBun, isInViewMain, isInViewSauce]);

  const handleTabClick = (categoryKey: string) => {
    setActiveCategory(categoryKey as TTabMode);

    switch (categoryKey) {
      case 'bun':
        sectionBunRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'main':
        sectionMainRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'sauce':
        sectionSauceRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
    }
  };

  return (
    <BurgerIngredientsUI
      currentTab={activeCategory}
      buns={bunItems}
      mains={mainItems}
      sauces={sauceItems}
      titleBunRef={sectionBunRef}
      titleMainRef={sectionMainRef}
      titleSaucesRef={sectionSauceRef}
      bunsRef={bunObserverRef}
      mainsRef={mainObserverRef}
      saucesRef={sauceObserverRef}
      onTabClick={handleTabClick}
    />
  );
};
