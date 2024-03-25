import express from "express";
import knex from 'knex'
import knexfile from './knexfile.js'

const port = 3000;

const app = express();
const db = knex(knexfile);

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    console.log('Incomming request', req.method, req.url)
    next()
});


app.get("/", async (req, res) => {
    const todos = await db().select('*').from('todos')
    res.render("index", {
        title: 'ToDos!',
        todos
    });
});

app.get("/todo/:id", async (req, res, next) => {
    const todo = await db('todos').select('*').where('id', req.params.id).first();

    if (!todo) return next()

    res.render("todo/todo-detail", {
        todo
    });
});

app.post("/add-todo", async (req, res) => {
    const text = String(req.body.text);
    await db('todos').insert({ text });
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

    await db('todos').update({ text: req.body.text }).where('id', todo.id)
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
