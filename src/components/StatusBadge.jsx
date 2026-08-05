import "../styles/StatusBadge.css";

const StatusBadge = ({ type, value }) => {
  const getClassName = () => {
    const v = (value || "").toLowerCase().replace(/_/g, " ").trim();

    if (type === "status") {
      switch (v) {
        case "open":
          return "status-open";

        case "assigned":
          return "status-assigned";

        case "progress":
        case "in progress":
          return "status-progress";

        case "qa":
          return "status-qa";

        case "done":
        case "closed":
          return "status-done";

        default:
          return "status-default";
      }
    }

    if (type === "priority") {
      switch (v) {
        case "critical":
          return "priority-critical";

        case "high":
          return "priority-high";

        case "medium":
          return "priority-medium";

        case "low":
          return "priority-low";

        default:
          return "priority-default";
      }
    }

    return "";
  };

  return (
    <span className={`status-badge ${getClassName()}`}>
      {value}
    </span>
  );
};

export default StatusBadge;
