import { describe, it, expect } from 'vitest';
import userReducer from '../slices/user-slice';

type UserState = ReturnType<typeof userReducer>;

describe('user-slice reducer', () => {
  it('should return initial state', () => {
    const state: UserState = userReducer(undefined, { type: 'UNKNOWN' });

    expect(state).toBeDefined();
  });
});
