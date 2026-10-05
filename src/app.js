const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const tasks = [
  { id: 1, title: "Configurer le projet", completed: true },
  { id: 2, title: "Ajouter l'API des tâches", completed: false },
  { id: 3, title: "Écrire les tests", completed: false }
];

let nextTaskId = 4;

function calculateTotal(items) {
 return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

app.get("/tasks", (_req, res) => {
  res.json(tasks);
});

app.post("/tasks", (req, res) => {
  const { title } = req.body;

  if (!title || typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({ error: "Le titre est obligatoire" });
  }

  const newTask = {
    id: nextTaskId++,
    title: title.trim(),
    completed: false
  };

  tasks.push(newTask);

  res.status(201).json(newTask);
});

app.get("/", (_req, res) => {
  res.json({
    service: "devops-platform-challenge",
    status: "ok"
  });
});

app.get("/health", (_req, res) => {
  res.json({ status: "healthy" });
});

app.get("/total", (_req, res) => {
  const items = [
    { price: 10, quantity: 2 },
    { price: 5, quantity: 3 }
  ];

  res.json({ total: calculateTotal(items) });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Application listening on port ${port}`);
  });
}

module.exports = { app, calculateTotal };