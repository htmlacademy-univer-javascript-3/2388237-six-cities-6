import { SORT_LABELS, SortType } from '../../const';

interface SortOptionsProps {
  sortType: SortType;
  onSortChange: (sort: SortType) => void;
}

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
        {Object.entries(SORT_LABELS).map(([key, label]) => {
          const typedKey = key as SortType;

          return (
            <li
              key={typedKey}
              className={`places__option ${sortType === typedKey ? 'places__option--active' : ''}`}
              tabIndex={0}
              onClick={() => onSortChange(typedKey)}
            >
              {label}
            </li>
          );
        })}
      </ul>
    </form>
  );
}
