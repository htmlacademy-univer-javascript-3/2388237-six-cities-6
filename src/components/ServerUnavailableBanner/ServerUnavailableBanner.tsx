import { useMemo } from 'react';

import { useAppSelector } from '../../hooks';
import { selectFavoritesError, selectOffersError, selectOfferPageError } from '../../store/selectors';

const looksLikeNetworkError = (value: string) => {
  const v = value.toLowerCase();
  return v.includes('network') || v.includes('timeout') || v.includes('failed to fetch');
};

export default function ServerUnavailableBanner(): JSX.Element | null {
  const offersError = useAppSelector(selectOffersError);
  const favoritesError = useAppSelector(selectFavoritesError);
  const offerPageError = useAppSelector(selectOfferPageError);

  const shouldShow = useMemo(() => {
    const errors = [offersError, favoritesError, offerPageError].filter(Boolean) as string[];
    return errors.some(looksLikeNetworkError);
  }, [offersError, favoritesError, offerPageError]);

  if (!shouldShow) {
    return null;
  }

  return (
    <div
      role="alert"
      style={{ padding: 12, background: '#2d2d2d', color: 'white', textAlign: 'center' }}
    >
      Сервер недоступен. Проверьте подключение к интернету и попробуйте ещё раз.
    </div>
  );
}
