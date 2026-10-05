const test = require("node:test");
const assert = require("node:assert/strict");
const { app, calculateTotal } = require("../src/app");

test("calculates the total for several items", () => {
  const items = [
    { price: 10, quantity: 2 },
    { price: 5, quantity: 3 }
  ];

  assert.equal(calculateTotal(items), 35);
});

test("returns zero for an empty basket", () => {
  assert.equal(calculateTotal([]), 0);
});

test("does not mutate the input items", () => {
  const items = [{ price: 4, quantity: 2 }];
  const copy = JSON.parse(JSON.stringify(items));

  calculateTotal(items);

  assert.deepEqual(items, copy);
});

test("returns the list of tasks", async () => {
  const server = app.listen(0);

  try {
    const response = await fetch(`http://localhost:${server.address().port}/tasks`);

    assert.equal(response.status, 200);

    const tasks = await response.json();

    assert.ok(Array.isArray(tasks));
    assert.ok(tasks.length > 0);

    for (const task of tasks) {
      assert.ok("id" in task);
      assert.ok("title" in task);
      assert.ok("completed" in task);
    }
  } finally {
    server.close();
  }
});

describe('PATCH /tasks/:id', () => {
  test('devrait marquer une tâche existante comme terminée (HTTP 200)', async () => {
    const res = await request(app)
      .patch('/tasks/1')
      .send({ completed: true });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', 1);
    expect(res.body.completed).toBe(true);
  });

  test('devrait renvoyer 404 si la tâche n\'existe pas', async () => {
    const res = await request(app)
      .patch('/tasks/9999')
      .send({ completed: true });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  test('devrait renvoyer 400 si la valeur de completed est invalide', async () => {
    const res = await request(app)
      .patch('/tasks/1')
      .send({ completed: "not-a-boolean" });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});