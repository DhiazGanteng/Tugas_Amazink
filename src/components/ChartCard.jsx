import "../styles/ChartCard.css";

const ChartCard = ({ title, action, children }) => {
  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3>{title}</h3>
        {action && <button>{action}</button>}
      </div>

      <div className="chart-body">{children}</div>
    </div>
  );
};

export default ChartCard;
