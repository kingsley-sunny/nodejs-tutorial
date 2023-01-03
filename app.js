const express = require("express");

const app = express();

// The home route middle ware
function homerouteMiddleware(req, res) {
    res.send(
        `<div><h1>Hello you are in the homepage</h1><a href="/users">Go to the users page</a></div>`
    );
    return res.end();
}

// The users route middle ware
function usersRouteMiddleware(req, res) {
    res.send(
        `<div><h1>Hello you are in the Users page</h1><a href="/">Go to the Home page</a></div>`
    );
    return res.end();
}

app.get("/", homerouteMiddleware);
app.get("/users", usersRouteMiddleware);

app.listen(3000);
