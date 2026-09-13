
import { useEffect, useState } from "react";
import "./App.css";

const initialTickets = [
  {
    id: 1,
    customerName: "Rahul Sharma",
    title: "Login problem",
    description: "Unable to log in to the account.",
    priority: "High",
    status: "Open",
    createdDate: "2026-09-12",
    updatedDate: "2026-09-12",
  },
  {
    id: 2,
    customerName: "Priya Singh",
    title: "Payment issue",
    description: "Payment was completed but order is not updated.",
    priority: "Medium",
    status: "In Progress",
    createdDate: "2026-09-11",
    updatedDate: "2026-09-12",
  },
  {
    id: 3,
    customerName: "Amit Kumar",
    title: "Password reset",
    description: "Customer requested a password reset.",
    priority: "Low",
    status: "Resolved",
    createdDate: "2026-09-10",
    updatedDate: "2026-09-11",
  },
];

function App() {
  const [tickets, setTickets] = useState(initialTickets);
    useEffect(() => {
    fetch("http://localhost:5000/api/tickets")
      .then((response) => response.json())
      .then((data) => {
        setTickets(data);
      })
      .catch((error) => {
        console.error("Error fetching tickets:", error);
      });
  }, []);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);

const [newTicket, setNewTicket] = useState({
  customerName: "",
  title: "",
  description: "",
  priority: "Medium",
  status: "Open",
});

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(search.toLowerCase()) ||
      ticket.customerName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || ticket.status === statusFilter;

    const matchesPriority =
      priorityFilter === "All" || ticket.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });
  const changeStatus = (id, newStatus) => {
  setTickets(
    tickets.map((ticket) =>
      ticket.id === id
        ? {
            ...ticket,
            status: newStatus,
            updatedDate: "2026-09-12",
          }
        : ticket
    )
  );
};

const handleCreateTicket = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:5000/api/tickets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTicket),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Failed to create ticket");
      return;
    }

    setTickets([...tickets, data]);

    setNewTicket({
      customerName: "",
      title: "",
      description: "",
      priority: "Medium",
      status: "Open",
    });

    setShowForm(false);
  } catch (error) {
    console.error("Error creating ticket:", error);
    alert("Could not connect to the server");
  }
};

  return (
    <div className="app">
      <header>
        <h1>Mini Service Ticket Management System</h1>
        <p>Manage customer service tickets efficiently</p>
      </header>

      <main>
        <section className="controls">
          <input
            type="text"
            placeholder="Search title or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
          <button
  className="create-button"
  onClick={() => setShowForm(!showForm)}
>
  + Create Ticket
</button>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="All">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </section>

        {showForm && (
  <form className="ticket-form" onSubmit={handleCreateTicket}>
    <h2>Create New Ticket</h2>

    <input
      type="text"
      placeholder="Customer Name"
      value={newTicket.customerName}
      onChange={(e) =>
        setNewTicket({ ...newTicket, customerName: e.target.value })
      }
      required
    />

    <input
      type="text"
      placeholder="Ticket Title"
      value={newTicket.title}
      onChange={(e) =>
        setNewTicket({ ...newTicket, title: e.target.value })
      }
      required
    />

    <textarea
      placeholder="Description"
      value={newTicket.description}
      onChange={(e) =>
        setNewTicket({ ...newTicket, description: e.target.value })
      }
      required
    />

    <select
      value={newTicket.priority}
      onChange={(e) =>
        setNewTicket({ ...newTicket, priority: e.target.value })
      }
    >
      <option value="Low">Low</option>
      <option value="Medium">Medium</option>
      <option value="High">High</option>
    </select>

    <select
      value={newTicket.status}
      onChange={(e) =>
        setNewTicket({ ...newTicket, status: e.target.value })
      }
    >
      <option value="Open">Open</option>
      <option value="In Progress">In Progress</option>
      <option value="Resolved">Resolved</option>
      <option value="Closed">Closed</option>
    </select>

    <button type="submit" className="save-button">
      Create Ticket
    </button>
  </form>
)}
        <section className="ticket-list">
          <h2>Tickets ({filteredTickets.length})</h2>

          {filteredTickets.map((ticket) => (
            <article className="ticket-card" key={ticket.id}>
              <div>
                <h3>#{ticket.id} — {ticket.title}</h3>
                <p><strong>Customer:</strong> {ticket.customerName}</p>
                <p>{ticket.description}</p>
                <p>
                  <strong>Priority:</strong> {ticket.priority}{" "}
                  | <strong>Status:</strong> {ticket.status}
                </p>
                <small>
                  Created: {ticket.createdDate} | Updated: {ticket.updatedDate}
                </small>
              </div>

              <div>
                <label>Change Status:</label>
                <select
                  value={ticket.status}
                  onChange={(e) =>
                    changeStatus(ticket.id, e.target.value)
                  }
                >
                  <option>Open</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                  <option>Closed</option>
                </select>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

export default App;