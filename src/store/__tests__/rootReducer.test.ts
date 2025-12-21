import { describe, it, expect } from 'vitest';
import { rootReducer } from '../reducer';

describe('rootReducer', () => {
  it('should return initial state', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN' });

    expect(state).toHaveProperty('offersReducer');
    expect(state.offersReducer).toEqual({
      city: 'Paris',
      offers: [],
      loading: false,
      error: null,
    });
  });
});
