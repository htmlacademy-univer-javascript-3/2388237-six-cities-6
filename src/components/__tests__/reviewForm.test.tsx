import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { AuthorizationStatus } from '../../const';
import ReviewForm from '../Reviews/ReviewForm';
import { postReviewAction } from '../../store/slices/offer-page-slice';

type Selector = (state: unknown) => unknown;

const dispatchMock = vi.fn<(a: unknown) => unknown>();
const useAppSelectorMock = vi.fn<(selector: Selector) => unknown>();

vi.mock('../../hooks', () => ({
  useAppDispatch: () => dispatchMock,
  useAppSelector: (selector: Selector) => useAppSelectorMock(selector),
}));

vi.mock('../../store/selectors', () => ({
  selectAuthorizationStatus: vi.fn(),
  selectOfferPagePosting: vi.fn(),
}));

describe('Component: ReviewForm', () => {
  it('should not render when user is not authorized', () => {
    useAppSelectorMock.mockReturnValueOnce(AuthorizationStatus.NoAuth);

    const { container } = render(<ReviewForm offerId="1" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('should enable submit when rating chosen and comment length >= 50, then dispatch on submit', async () => {
    const user = userEvent.setup();

    useAppSelectorMock
      .mockReturnValueOnce(AuthorizationStatus.Auth)
      .mockReturnValueOnce(false);

    dispatchMock.mockClear();

    dispatchMock.mockImplementation(() => postReviewAction.fulfilled(
      [],
      'request-id',
      { offerId: '1', comment: 'a'.repeat(50), rating: 5 }
    ));

    render(<ReviewForm offerId="1" />);

    const submit = screen.getByRole('button', { name: /submit/i });
    expect(submit.hasAttribute('disabled')).toBe(true);

    await user.click(screen.getByTitle('5'));

    const textarea = screen.getByPlaceholderText(
      'Tell how was your stay, what you like and what can be improved'
    );
    await user.type(textarea, 'a'.repeat(50));

    expect(submit.hasAttribute('disabled')).toBe(false);

    await user.click(submit);

    expect(dispatchMock).toHaveBeenCalled();
  });

  it('should keep submit disabled when posting', () => {
    useAppSelectorMock
      .mockReturnValueOnce(AuthorizationStatus.Auth)
      .mockReturnValueOnce(true);

    render(<ReviewForm offerId="1" />);

    const submit = screen.getByRole('button', { name: /submitting/i });
    expect(submit.hasAttribute('disabled')).toBe(true);
  });
});
