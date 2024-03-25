import express from "express";
import knex from 'knex'
import knexfile from './knexfile.js'

const port = 3000;

const app = express();
const db = knex(knexfile);

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));


function getPriorityName(priorityNumber) {
    for (const key in priority) {
        if (priority[key] === priorityNumber) {
            return key;
        }
    }
    return "Unknown";
}


const priority = Object.freeze({
    "Nízká": 0,
    "Střední": 1,
    "Vysoká": 2,
});

app.use((req, res, next) => {
    console.log('Incomming request', req.method, req.url)
    next()
});


app.get("/", async (req, res) => {
    const todos = await db().select('*').from('todos');
    const todosWithPriorityNames = todos.map(todo => {
        return {
            id: todo.id,
            text: todo.text,
            priority: todo.priority,
            priorityText: getPriorityName(todo.priority)
        };
    });
    res.render("index", {
        title: 'ToDos!',
        todos: todosWithPriorityNames
    });
});

app.get("/todo/:id", async (req, res, next) => {
    const todo = await db('todos').select('*').where('id', req.params.id).first();
    if (!todo) return next();

    todo.priorityText = getPriorityName(todo.priority);
    res.render("todo/todo-detail", {
        todo
    });
});

app.post("/add-todo", async (req, res) => {
    const text = String(req.body.text);
    const priority = Number(req.body.priority)
    await db('todos').insert({ text, priority });
    res.redirect("/");
});

app.post("/toggle-todo/:id", async (req, res, next) => {
    const todo = await db('todos').select('*').where('id', req.params.id).first();

    if (!todo) return next();

    await db('todos').update({ done: !todo.done }).where('id', todo.id);
    res.redirect('back');
});

app.post("/edit-todo/:id", async (req, res, next) => {
    const todo = await db('todos').select('*').where('id', req.params.id).first();

    if (!todo) return next();

    await db('todos').update({ text: req.body.text, priority: req.body.priority, done: req.body.done }).where('id', todo.id)
    res.redirect("/todo/" + todo.id);
});

app.post("/remove-todo/:id", async (req, res, next) => {
    const todo = await db('todos').select('*').where('id', req.params.id).first();

    if (!todo) return next();

    await db('todos').delete().where('id', todo.id)

    res.redirect("/");
});

app.use((req, res) => {
    res.status(404);
    res.send('404 - Stránka nenalezena');
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500);
    res.send('500 - Chyba na straně serveru');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
