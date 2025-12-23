import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import LoginPage from './LoginPage';
vi.mock('../Header/Header', () => ({
  default: () => null,
}));
import { AuthorizationStatus } from '../../const';

type UnknownState = Record<string, unknown>;
type Selector<T> = (state: UnknownState) => T;

type LoginPayload = { email: string; password: string };
type ThunkResult = { type: string };

const mockDispatch = vi.fn<(action: unknown) => Promise<ThunkResult>>();
const mockNavigateHook = vi.fn<(to: string) => void>();
const mockNavigate = vi.fn<(to: string) => void>();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigateHook,
    Navigate: (props: { to: string }) => {
      mockNavigate(props.to);
      return null;
    },
  };
});

vi.mock('../../hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: <T,>(selector: Selector<T>): T => selector({}),
}));

const mockSelectAuthorizationStatus = vi.fn<(state: UnknownState) => AuthorizationStatus>();

vi.mock('../../store/selectors', () => ({
  selectAuthorizationStatus: (state: UnknownState) => mockSelectAuthorizationStatus(state),
}));

const hoisted = vi.hoisted(() => {
  const loginAction = Object.assign(
    vi.fn((payload: LoginPayload) => ({ type: 'user/login', meta: { arg: payload } })),
    {
      fulfilled: {
        match: (action: ThunkResult) => action.type === 'user/login/fulfilled',
      },
    }
  );

  return { loginAction };
});

vi.mock('../../store/slices/user-slice', () => ({
  loginAction: hoisted.loginAction,
}));

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDispatch.mockResolvedValue({ type: 'user/login/rejected' });
  });

  it('redirects to / when authorized', () => {
    mockSelectAuthorizationStatus.mockReturnValue(AuthorizationStatus.Auth);

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('renders form when not authorized', () => {
    mockSelectAuthorizationStatus.mockReturnValue(AuthorizationStatus.NoAuth);

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('dispatches loginAction and navigates to / on fulfilled', async () => {
    mockSelectAuthorizationStatus.mockReturnValue(AuthorizationStatus.NoAuth);
    mockDispatch.mockResolvedValue({ type: 'user/login/fulfilled' });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText(/email/i), 'test@test.ru');
    await user.type(screen.getByPlaceholderText(/password/i), 'a123456');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(hoisted.loginAction).toHaveBeenCalledWith({ email: 'test@test.ru', password: 'a123456' });
    expect(mockNavigateHook).toHaveBeenCalledWith('/');
  });

  it('does not navigate on rejected', async () => {
    mockSelectAuthorizationStatus.mockReturnValue(AuthorizationStatus.NoAuth);
    mockDispatch.mockResolvedValue({ type: 'user/login/rejected' });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText(/email/i), 'bad@test.ru');
    await user.type(screen.getByPlaceholderText(/password/i), 'bad');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(mockNavigateHook).not.toHaveBeenCalled();
  });
});
