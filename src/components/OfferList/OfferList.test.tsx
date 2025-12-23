import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

import OfferList from './OfferList';
import type { Offer } from '../../types/offer';

const offerCardMock = vi.fn<(props: { offer: Offer; onHover?: (id: string | null) => void }) => void>();

vi.mock('../OfferCard/OfferCard', () => ({
  default: (props: { offer: Offer; onHover?: (id: string | null) => void }) => {
    offerCardMock(props);
    return (
      <div data-testid="offer-card">
        {props.offer.title}
        <button type="button" onClick={() => props.onHover?.(props.offer.id)}>
          hover
        </button>
      </div>
    );
  },
}));

describe('OfferList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders OfferCard for each offer', () => {
    const offers = [
      { id: '1', title: 'Offer 1' } as unknown as Offer,
      { id: '2', title: 'Offer 2' } as unknown as Offer,
    ];

    render(<OfferList offers={offers} />);

    expect(screen.getAllByTestId('offer-card')).toHaveLength(2);
    expect(screen.getByText('Offer 1')).toBeInTheDocument();
    expect(screen.getByText('Offer 2')).toBeInTheDocument();
    expect(offerCardMock).toHaveBeenCalledTimes(2);
  });

  it('passes onOfferHover to cards', () => {
    const onHover = vi.fn<(id: string | null) => void>();
    const offers = [{ id: '1', title: 'Offer 1' } as unknown as Offer];

    render(<OfferList offers={offers} onOfferHover={onHover} />);

    screen.getByRole('button', { name: 'hover' }).click();
    expect(onHover).toHaveBeenCalledWith('1');
  });
});
