const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();

app.use(express.json());
app.use(cors());
app.get("/api/tickets", (req, res) => {
  const tickets = db.prepare("SELECT * FROM tickets").all();

  res.status(200).json(tickets);
});
app.post("/api/tickets", (req, res) => {
  const {
    customerName,
    title,
    description,
    priority,
    status
  } = req.body;

  if (!customerName || !title || !description || !priority || !status) {
    return res.status(400).json({
      error: "All fields are required"
    });
  }

  const today = new Date().toISOString().split("T")[0];

  const result = db.prepare(`
    INSERT INTO tickets
    (customerName, title, description, priority, status, createdDate, updatedDate)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    customerName,
    title,
    description,
    priority,
    status,
    today,
    today
  );

  const newTicket = db
    .prepare("SELECT * FROM tickets WHERE id = ?")
    .get(result.lastInsertRowid);

  res.status(201).json(newTicket);
});
app.get("/api/tickets/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      error: "Invalid ticket ID"
    });
  }

  const ticket = db
    .prepare("SELECT * FROM tickets WHERE id = ?")
    .get(id);

  if (!ticket) {
    return res.status(404).json({
      error: "Ticket not found"
    });
  }

  res.status(200).json(ticket);
});
app.put("/api/tickets/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      error: "Invalid ticket ID"
    });
  }

  const ticket = db
    .prepare("SELECT * FROM tickets WHERE id = ?")
    .get(id);

  if (!ticket) {
    return res.status(404).json({
      error: "Ticket not found"
    });
  }

  const {
    customerName,
    title,
    description,
    priority,
    status
  } = req.body;

  if (!customerName || !title || !description || !priority || !status) {
    return res.status(400).json({
      error: "All fields are required"
    });
  }

  const updatedDate = new Date().toISOString().split("T")[0];

  db.prepare(`
    UPDATE tickets
    SET customerName = ?,
        title = ?,
        description = ?,
        priority = ?,
        status = ?,
        updatedDate = ?
    WHERE id = ?
  `).run(
    customerName,
    title,
    description,
    priority,
    status,
    updatedDate,
    id
  );

  const updatedTicket = db
    .prepare("SELECT * FROM tickets WHERE id = ?")
    .get(id);

  res.status(200).json(updatedTicket);
});
app.delete("/api/tickets/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      error: "Invalid ticket ID"
    });
  }

  const ticket = db
    .prepare("SELECT * FROM tickets WHERE id = ?")
    .get(id);

  if (!ticket) {
    return res.status(404).json({
      error: "Ticket not found"
    });
  }

  db.prepare("DELETE FROM tickets WHERE id = ?").run(id);

  res.status(200).json({
    message: "Ticket deleted successfully"
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

