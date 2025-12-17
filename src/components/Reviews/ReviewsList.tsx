import { Review as ReviewType } from '../../types/review';
import Review from './Review';

type ReviewsListProps = {
  reviews: ReviewType[];
};

export default function ReviewsList({ reviews }: ReviewsListProps): JSX.Element {
  return (
    <ul className="reviews__list">
      {reviews.map((review) => (
        <Review key={review.id} review={review} />
      ))}
    </ul>
  );
}
