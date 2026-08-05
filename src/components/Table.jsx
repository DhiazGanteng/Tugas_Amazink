import {
  FaEye,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

import StatusBadge from "./StatusBadge";
import "../styles/Table.css";

const Table = ({ tickets = [] }) => {
  return (
    <div className="table-card">

      <div className="table-header">

        <h3>Ticket List</h3>

        <input
          type="text"
          placeholder="Search ticket..."
        />

      </div>

      <div className="table-responsive">

        <table>

          <thead>

            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Reporter</th>
              <th>Date</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody>

            {tickets.map((ticket) => (

              <tr key={ticket.id}>

                <td>{ticket.id}</td>

                <td>{ticket.title}</td>

                <td>{ticket.category}</td>

                <td>

                  <StatusBadge
                    type="status"
                    value={ticket.status}
                  />

                </td>

                <td>

                  <StatusBadge
                    type="priority"
                    value={ticket.priority}
                  />

                </td>

                <td>{ticket.reporter}</td>

                <td>{ticket.date}</td>

                <td>

                  <div className="action-btn">

                    <button className="view">

                      <FaEye />

                    </button>

                    <button className="edit">

                      <FaEdit />

                    </button>

                    <button className="delete">

                      <FaTrash />

                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default Table;
