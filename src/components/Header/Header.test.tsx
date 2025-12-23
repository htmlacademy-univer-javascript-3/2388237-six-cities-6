import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import Header from './Header';
import { AuthorizationStatus } from '../../const';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/' }),
  };
});

type UnknownState = Record<string, unknown>;
type Selector<T> = (state: UnknownState) => T;

const mockDispatch = vi.fn<(action?: unknown) => unknown>();

vi.mock('../../hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: <T,>(selector: Selector<T>): T => selector({}),
}));

const mockSelectAuthorizationStatus = vi.fn<() => AuthorizationStatus>();
const mockSelectUser = vi.fn<() => { email: string; avatarUrl?: string } | null>();
const mockSelectFavoriteCount = vi.fn<() => number>();

vi.mock('../../store/selectors', () => ({
  selectAuthorizationStatus: () => mockSelectAuthorizationStatus(),
  selectUser: () => mockSelectUser(),
  selectFavoriteCount: () => mockSelectFavoriteCount(),
}));

vi.mock('../../services/token', () => ({
  dropToken: vi.fn(),
}));

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Sign in when user is not authorized', () => {
    mockSelectAuthorizationStatus.mockReturnValue(AuthorizationStatus.NoAuth);
    mockSelectUser.mockReturnValue(null);
    mockSelectFavoriteCount.mockReturnValue(0);

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText(/Sign in/i)).toBeInTheDocument();
  });

  it('renders user email and favorites count when authorized', () => {
    mockSelectAuthorizationStatus.mockReturnValue(AuthorizationStatus.Auth);
    mockSelectUser.mockReturnValue({ email: 'test@mail.com', avatarUrl: 'img.jpg' });
    mockSelectFavoriteCount.mockReturnValue(7);

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText('test@mail.com')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText(/Sign out/i)).toBeInTheDocument();
  });
});
