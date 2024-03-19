import express from "express";

const port = 3000;

const app = express();

const todos = [
  { id: 1, title: "First Todo", done: false },
  { id: 2, title: "Second Todo", done: true }
];

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }))


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/", (req, res) => {
    res.render("index", {
        todos
    });
    console.log(todos);
});

app.get("/todo/:id", (req, res) => {
    const id = Number(req.params.id);
    const todo = todos.find(todo => todo.id === id);
    if(!todo) return res.redirect("/nenalezeno");
    res.render("todo/todo-detail", {
        todo
    });
});

app.post("/add-todo", (req, res) => {
    const todo = req.body;
    todos.push({
        id: todos.length + 1,
        title: todo.title,
        done: false
    });
    res.redirect("/");
});

app.post("/toggle-todo/:id", (req, res) => {
    const id = req.params.id;
    const todo = todos.find(todo => todo.id === Number(id));
    todo.done = !todo.done;
    res.redirect('back');
});

app.post("/edit-todo/:id", (req, res) => {
    const todoData = req.body;
    const todo = todos.find(todo => todo.id === Number(req.params.id));
    todo.title = todoData.title;
    todo.done = todoData.done === "on";
    res.redirect("/todo/" + todo.id);
});

app.post("/remove-todo/:id", (req, res) => {
    const id = req.params.id;
    const todoIndex = todos.findIndex(todo => todo.id === Number(id));
    todos.splice(todoIndex, 1);
    res.redirect("/");
});

app.get("/nenalezeno", (req, res) => {
    res.status(404).render("404");
});

