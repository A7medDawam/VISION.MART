import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <section className="container-shell page-section">
      <div className="section-card center-box">
        <h1>404</h1>
        <p>Page not found.</p>
        <Link className="solid-btn" to="/">Go Home</Link>
      </div>
    </section>
  );
}

export default NotFound;
