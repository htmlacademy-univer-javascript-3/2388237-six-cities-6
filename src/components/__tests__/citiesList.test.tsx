import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { CityName } from '../../const';
import CitiesList from '../cities-list/cities-list';

describe('Component: CitiesList', () => {
  it('should call onCityClick on link click', async () => {
    const user = userEvent.setup();
    const onCityClick = vi.fn<(city: CityName) => void>();

    const cities = ['Paris', 'Cologne'] as unknown as readonly CityName[];
    const activeCity = 'Paris' as unknown as CityName;

    render(<CitiesList cities={cities} activeCity={activeCity} onCityClick={onCityClick} />);

    await user.click(screen.getByText('Cologne'));

    expect(onCityClick).toHaveBeenCalledWith('Cologne' as unknown as CityName);
  });

  it('should apply active class for active city', () => {
    const cities = ['Paris', 'Cologne'] as unknown as readonly CityName[];
    const activeCity = 'Paris' as unknown as CityName;

    render(<CitiesList cities={cities} activeCity={activeCity} onCityClick={() => undefined} />);

    const activeLink = screen.getByText('Paris').closest('a');
    expect(activeLink).not.toBeNull();
    expect(activeLink).toHaveClass('tabs__item--active');
  });
});
