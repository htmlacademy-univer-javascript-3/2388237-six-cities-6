import { describe, it, expect } from 'vitest';
import { rootReducer } from '../root-reducer';

describe('rootReducer', () => {
  it('should return initial state', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN' });

    expect(state).toBeDefined();
  });
});
