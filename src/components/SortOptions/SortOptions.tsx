import React from 'react';

export type SortType = 'popular' | 'priceLowToHigh' | 'priceHighToLow' | 'topRated';

interface SortOptionsProps {
  sortType: SortType;
  onSortChange: (sort: SortType) => void;
}

const SORT_LABELS: Record<SortType, string> = {
  popular: 'Popular',
  priceLowToHigh: 'Price: low to high',
  priceHighToLow: 'Price: high to low',
  topRated: 'Top rated first',
};

export default function SortOptions({ sortType, onSortChange }: SortOptionsProps) {
  return (
    <form className="places__sorting" action="#" method="get">
      <span className="places__sorting-caption">Sort by</span>
      <span className="places__sorting-type" tabIndex={0}>
        {SORT_LABELS[sortType]}
        <svg className="places__sorting-arrow" width={7} height={4}>
          <use xlinkHref="#icon-arrow-select"></use>
        </svg>
      </span>
      <ul className="places__options places__options--custom places__options--opened">
        {Object.entries(SORT_LABELS).map(([key, label]) => (
          <li
            key={key}
            className={`places__option ${sortType === key ? 'places__option--active' : ''}`}
            tabIndex={0}
            onClick={() => onSortChange(key as SortType)}
          >
            {label}
          </li>
        ))}
      </ul>
    </form>
  );
}
