import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { AuthorizationStatus } from '../../const';
import ReviewForm from '../Reviews/ReviewForm';
import { postReviewAction } from '../../store/slices/offer-page-slice';
import {
  selectAuthorizationStatus,
  selectOfferPagePosting,
} from '../../store/selectors';

type Selector<T = unknown> = (state: unknown) => T;

const dispatchMock = vi.fn<(a: unknown) => unknown>();

vi.mock('../../hooks', () => ({
  useAppDispatch: () => dispatchMock,
  useAppSelector: vi.fn(),
}));

import { useAppSelector } from '../../hooks';

describe('Component: ReviewForm', () => {
  it('should not render when user is not authorized', () => {
    vi.mocked(useAppSelector as unknown as (s: Selector) => unknown).mockImplementation(
      (selector: Selector) => {
        if (selector === selectAuthorizationStatus) {
          return AuthorizationStatus.NoAuth;
        }
        if (selector === selectOfferPagePosting) {
          return false;
        }
        return undefined;
      }
    );

    const { container } = render(<ReviewForm offerId="1" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('should enable submit when rating chosen and comment length >= 50, then dispatch on submit', async () => {
    const user = userEvent.setup();

    vi.mocked(useAppSelector as unknown as (s: Selector) => unknown).mockImplementation(
      (selector: Selector) => {
        if (selector === selectAuthorizationStatus) {
          return AuthorizationStatus.Auth;
        }
        if (selector === selectOfferPagePosting) {
          return false;
        }
        return undefined;
      }
    );

    dispatchMock.mockClear();
    dispatchMock.mockImplementation(() =>
      postReviewAction.fulfilled(
        [],
        'request-id',
        { offerId: '1', comment: 'a'.repeat(50), rating: 5 }
      )
    );

    render(<ReviewForm offerId="1" />);

    expect(screen.getByText('Your review')).toBeInTheDocument();

    await user.click(screen.getByTitle('5'));

    const textarea = screen.getByLabelText('Your review');
    await user.type(textarea, 'a'.repeat(50));

    const submit = screen.getByRole('button', { name: /submit/i });
    expect(submit).toBeEnabled();

    await user.click(submit);
    expect(dispatchMock).toHaveBeenCalledTimes(1);
  });

  it('should keep submit disabled when posting', () => {
    vi.mocked(useAppSelector as unknown as (s: Selector) => unknown).mockImplementation(
      (selector: Selector) => {
        if (selector === selectAuthorizationStatus) {
          return AuthorizationStatus.Auth;
        }
        if (selector === selectOfferPagePosting) {
          return true;
        }
        return undefined;
      }
    );

    render(<ReviewForm offerId="1" />);

    expect(screen.getByRole('button', { name: /submitting/i })).toBeDisabled();
  });
});
