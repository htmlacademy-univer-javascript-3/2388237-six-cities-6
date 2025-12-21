import { describe, it, expect } from 'vitest';
import offersReducer, { changeCity } from '../slices/offers-slice';

type OffersState = ReturnType<typeof offersReducer>;

describe('offers-slice reducer', () => {
  it('should return initial state', () => {
    const state: OffersState = offersReducer(undefined, { type: 'UNKNOWN' });

    expect(state).toHaveProperty('city');
    expect(state).toHaveProperty('offers');
  });

  it('should handle changeCity', () => {
    const prev: OffersState = offersReducer(undefined, { type: 'UNKNOWN' });
    const next: OffersState = offersReducer(prev, changeCity('Amsterdam'));

    expect(next.city).toBe('Amsterdam');
  });
});
