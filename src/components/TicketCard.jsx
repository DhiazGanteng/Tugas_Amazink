import {
  FaUserCircle,
  FaCalendarAlt,
} from "react-icons/fa";

import StatusBadge from "./StatusBadge";

import "../styles/TicketCard.css";

const TicketCard = ({
  id,
  title,
  category,
  status,
  priority,
  reporter,
  date,
  onClick,
}) => {
  return (
    <button
      type="button"
      className="ticket-card"
      onClick={onClick}
    >

      <div className="ticket-top">

        <div>

          <span className="ticket-id">
            {id}
          </span>

          <h3>{title}</h3>

        </div>

        <StatusBadge
          type="priority"
          value={priority}
        />

      </div>

      <div className="ticket-tag">

        <span className="category">
          {category}
        </span>

        <StatusBadge
          type="status"
          value={status}
        />

      </div>

      <div className="ticket-footer">

        <div className="ticket-user">

          <FaUserCircle />

          <span>{reporter}</span>

        </div>

        <div className="ticket-date">

          <FaCalendarAlt />

          <span>{date}</span>

        </div>

      </div>

    </button>
  );
};

export default TicketCard;
