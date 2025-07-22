const express = require('express');
const cors = require('cors')
const jwt = require("jsonwebtoken");
const JWT_SECRET = "meri12458marzi";
const app = express();
app.use(express.json());
app.use(cors());
let users = [];
let todos = [];
function auth(req, res, next) {
    const token = req.headers.token;
    try {
        const decodedData = jwt.verify(token, JWT_SECRET);

        if (decodedData.username) {
            req.username = decodedData.username;
            next();
        } else {
            res.status(401).json({ message: "Invalid token" });
        }
    } catch (err) {
        res.status(401).json({ message: "You are not logged in" });
    }
}

app.post("/signup", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  users.push({ username, password });
  res.status(200).send("Signup successful");
});
app.post("/signin", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    let foundUser = null;

    for (let i = 0; i < users.length; i++) {
        if (users[i].username === username && users[i].password === password) {
            foundUser = users[i]
        }
    }

    if (!foundUser) {
        res.json({
            message: "Credentials incorrect"
        })
        return 
    } else {
        const token = jwt.sign({
            username: foundUser.username
        }, JWT_SECRET);
        res.header("jwt", token);
        res.json({
            token: token
        })
    }
})
app.post("/add/todo", auth, (req, res) => {
    const username = req.username;
    const todo = req.body.todo;

    if (!todos[username]) {
        todos[username] = [];
    }

    todos[username].push(todo);

    res.json({
        message: "Todo added successfully"
    });
});

app.get("/todos", auth, (req, res) => {
    const username = req.username;
    res.json({
        todos: todos[username] || []
    });
});

app.listen(3000);
