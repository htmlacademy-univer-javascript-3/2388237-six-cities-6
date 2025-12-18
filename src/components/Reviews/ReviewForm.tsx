import { FormEvent, useMemo, useState } from 'react';

import { AuthorizationStatus } from '../../const';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { selectAuthorizationStatus, selectOfferPagePosting } from '../../store/selectors';
import { postReviewAction } from '../../store/slices/offer-page-slice';

type ReviewFormProps = {
  offerId: string;
};

export default function ReviewForm({ offerId }: ReviewFormProps): JSX.Element | null {
  const dispatch = useAppDispatch();

  const authorizationStatus = useAppSelector(selectAuthorizationStatus);
  const isPosting = useAppSelector(selectOfferPagePosting);

  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');

  const isValid = useMemo(() => {
    const len = comment.trim().length;
    return rating >= 1 && rating <= 5 && len >= 50 && len <= 300;
  }, [rating, comment]);

  if (authorizationStatus !== AuthorizationStatus.Auth) {
    return null;
  }

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    if (!isValid || isPosting) {
      return;
    }

    void (async () => {
      const result = await dispatch(
        postReviewAction({ offerId, comment: comment.trim(), rating })
      );

      if (!postReviewAction.fulfilled.match(result)) {
        return;
      }

      setRating(0);
      setComment('');
    })();
  };

  return (
    <form className="reviews__form form" onSubmit={handleSubmit}>
      <label className="reviews__label form__label" htmlFor="review">
        Your review
      </label>

      <div className="reviews__rating-form form__rating">
        {[5, 4, 3, 2, 1].map((value) => (
          <span key={value}>
            <input
              className="form__rating-input visually-hidden"
              name="rating"
              value={value}
              id={`${value}-stars`}
              type="radio"
              checked={rating === value}
              disabled={isPosting}
              onChange={() => setRating(value)}
            />
            <label
              className="reviews__rating-label form__rating-label"
              htmlFor={`${value}-stars`}
              title={`${value}`}
            >
              <svg className="form__star-image" width="37" height="33">
                <use xlinkHref="#icon-star" />
              </svg>
            </label>
          </span>
        ))}
      </div>

      <textarea
        className="reviews__textarea form__textarea"
        id="review"
        name="review"
        placeholder="Tell how was your stay, what you like and what can be improved"
        value={comment}
        disabled={isPosting}
        onChange={(e) => setComment(e.target.value)}
      />

      <div className="reviews__button-wrapper">
        <p className="reviews__help">
          To submit review please make sure to set rating and describe your stay with at least 50 characters.
        </p>
        <button
          className="reviews__submit form__submit button"
          type="submit"
          disabled={!isValid || isPosting}
        >
          {isPosting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </form>
  );
}
