import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import SortOptions, { SortType } from '../SortOptions/SortOptions';

describe('Component: SortOptions', () => {
  it('should call onSortChange with selected sort type on click', async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn<(sort: SortType) => void>();

    render(<SortOptions sortType="popular" onSortChange={onSortChange} />);

    await user.click(screen.getByText('Price: low to high'));
    expect(onSortChange).toHaveBeenCalledWith('priceLowToHigh');
  });

  it('should mark active option with active class', () => {
    const onSortChange = vi.fn<(sort: SortType) => void>();

    const { container } = render(<SortOptions sortType="topRated" onSortChange={onSortChange} />);

    const active = container.querySelector('li.places__option--active');
    expect(active).not.toBeNull();

    expect(active?.textContent).toContain('Top rated first');
  });
});
