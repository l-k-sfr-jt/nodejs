import test from "ava"
import supertest from "supertest"
import {app} from "../src/app.js"
import {db} from "../src/db.js"

test.beforeEach(async () => {
    await db.migrate.latest();
})

test.afterEach(async () => {
    await db.migrate.rollback();
})

test.serial("it renders a list of todos", async (t) => {
    const response = await supertest.agent(app).get("/");

    t.assert(response.text.includes("<h1>ToDos!</h1>"));
});

test.serial("create new todo", async (t) => {
    await db("todos").insert({
        text: "Moje todo",
    })

    const response = await supertest.agent(app).get("/")

    t.assert(response.text.includes("Moje todo"))
});

test.serial("create new todo via form", async (t) => {
    const response = await supertest
        .agent(app)
        .post("/add-todo")
        .type("form")
        .send({text: "Nějaký název", priority: 0})
        .redirects(1)

    t.assert(response.text.includes("Nějaký název"))
});

test.serial("create new todo via form without heading should return an error", async (t) => {
    const response = await supertest
        .agent(app)
        .post("/add-todo")
        .type("form")
        .send({ priority: 0})
        .redirects(1)

    t.assert(response.text.includes("Text is required."))
});

test.serial("it toggles todo", async (t) => {
    const [id] = await db("todos").insert({
        text: "Moje todo",
    })

    await supertest.agent(app).post(`/toggle-todo/${id}`).redirects(1)

    const todo = await db("todos").where("id", id).first()

    t.assert(todo.done)
});

test.serial("it deletes todo", async (t) => {
    const [id] = await db("todos").insert({
        text: "Moje todo"
    });

    await supertest.agent(app).post(`/remove-todo/${id}`).redirects(1);
    const todo = await db("todos").where("id", id).first();
    t.assert(todo === undefined);

});

test.serial("it deletes todo that doesn't exist", async (t) => {
    const id = 1;
    const response = await supertest.agent(app).post(`/remove-todo/${id}`).redirects(1);
    t.assert(response.text.includes("404 - Stránka nenalezena"));
});

test.serial("it edits todo", async (t) => {
    const [id] = await db("todos").insert({
        text: "Moje todo",
        priority: 1,
        done: false
    });

    const todo = await db("todos").where("id", id).first();
    t.assert(todo.text === "Moje todo");
    t.assert(todo.priority === 1);
    t.assert(todo.done === 0);

    const newHeading = "Another heading";
    const newPriority = 2;
    const done = 1;

    await supertest.agent(app)
        .post(`/edit-todo/${id}`)
        .type("form")
        .send({text: newHeading, priority: newPriority, done: done})
        .redirects(1);

    const editedTodo = await db("todos").where("id", id).first();
    t.assert(editedTodo.text === newHeading);
    t.assert(editedTodo.priority === newPriority);
    t.assert(editedTodo.done === done);
});

test.serial("it renders todo detail", async (t) => {
    const text = "Koupit mliko";
    const priority = 3;
    const done = 0;

    const [id] = await db("todos").insert({
        text,
        priority,
        done
    });

    const response = await supertest.agent(app).get(`/todo/${id}`);

    t.assert(response.text.includes(text));
});

test.serial("it should renders 404 if todo doesn't exit", async (t) => {

    const response = await supertest.agent(app).get(`/todo/4`);

    t.assert(response.text.includes("404 - Stránka nenalezena"));
});