import { describe, it, expect } from 'vitest';
import offerPageReducer from '../slices/offer-page-slice';

type OfferPageState = ReturnType<typeof offerPageReducer>;

describe('offer-page-slice reducer', () => {
  it('should return initial state', () => {
    const state: OfferPageState = offerPageReducer(undefined, { type: 'UNKNOWN' });

    expect(state).toBeDefined();
  });
});
