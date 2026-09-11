import "./Card.css";
function Card({ children, title }) {
  return (
    <div className="common-card">
      {title && <h3 className="card-title">{title}</h3>}
      <div className="card-content">{children}</div>
    </div>
  );
}

export default Card;