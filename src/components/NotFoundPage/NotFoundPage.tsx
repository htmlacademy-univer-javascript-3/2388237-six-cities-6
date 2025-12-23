import { Link } from 'react-router-dom';
import Header from '../Header/Header';

function NotFoundPage() {
  return (
    <div className="page">
      <Header />
      <main style={{ textAlign: 'center', padding: '50px' }}>
        <h1>404 Not Found</h1>
        <p>Извините, страница, которую вы ищете, не найдена.</p>
        <Link to="/">Вернуться на главную</Link>
      </main>
    </div>
  );
}

export default NotFoundPage;
