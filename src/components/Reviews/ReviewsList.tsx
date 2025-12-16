import { Review as ReviewType } from '../../mocks/reviews';
import Review from './Review';

type ReviewsListProps = {
  reviews: ReviewType[];
};

export default function ReviewsList({ reviews }: ReviewsListProps) {
  return (
    <section className="offer__reviews reviews">
      <div className="container">
        <h2 className="reviews__title">
          Reviews &middot; <span className="reviews__amount">{reviews.length}</span>
        </h2>
        <ul className="reviews__list">
          {reviews.map((review) => (
            <Review key={review.id} review={review} />
          ))}
        </ul>
      </div>
    </section>
  );
}
