import "../styles/Card.css";

const Card = ({ title, value, icon, color = "blue" }) => {
  return (
    <div className="dashboard-card">
      <div className={`card-icon ${color}`}>{icon}</div>
      <div className="card-content">
        <h2>{value}</h2>
        <p>{title}</p>
      </div>
    </div>
  );
};

export default Card;
