import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SortOptions from './SortOptions';
import { SortType } from '../../const';

describe('SortOptions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders current sort label in the current sort element', () => {
    const onSortChange = vi.fn();
    render(<SortOptions sortType={SortType.Popular} onSortChange={onSortChange} />);

    const currentSort = screen.getByText('Popular', { selector: '.places__sorting-type' });
    expect(currentSort).toBeInTheDocument();
  });

  it('calls onSortChange when option clicked', async () => {
    const onSortChange = vi.fn();
    const user = userEvent.setup();

    render(<SortOptions sortType={SortType.TopRated} onSortChange={onSortChange} />);

    const option = screen.getByText('Price: low to high', { selector: '.places__option' });
    await user.click(option);

    expect(onSortChange).toHaveBeenCalledWith(SortType.PriceLowToHigh);
  });
});
