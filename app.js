const fs = require("fs");
const http = require("http");

const usersData = [];

function handleRequest(req, res) {}

const server = http.createServer((req, res) => {
    const route = req.url;
    const method = req.method;

    if (route === "/") {
        res.setHeader("Content-Type", "text/html");
        res.statusCode = 200;
        res.write(`<div>
    <h1>Welcome to my first nodejs assignment</h1>
    <br/>
    <a href="/users"> view all the users of this application </a>
    <br/>
    <a href="/create-user"> create a user </a>

    </div>`);
        return res.end();
    }

    if (route === "/create-user" && method === "GET") {
        res.setHeader("Content-Type", "text/html");
        res.statusCode = 200;
        res.write(`<form method="POST" action="/create-user">
            <input type="text" name="username" />
            <button type="submit">Create A User</button>
        </form>`);
        return res.end();
    }

    if (route === "/create-user" && method === "POST") {
        req.on("data", chunk => {
            const parsedBody = chunk.toLocaleString();
            const data = parsedBody.split("=")[1];
            usersData.push(data);

            fs.readFile("users.json", (err, data) => {
                if (err) {
                    console.log(err);
                    return;
                }
                if (!data.toString()) {
                    fs.writeFile("users.json", JSON.stringify(usersData), () => {});

                    res.setHeader("Content-Type", "text/html");
                    res.writeHead(301, { Location: "/users" });
                    return res.end();
                }

                const parsedData = JSON.parse(data);
                fs.writeFile(
                    "users.json",
                    JSON.stringify([...parsedData, ...usersData]),
                    (err, dat) => {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        res.setHeader("Content-Type", "text/html");
                        res.writeHead(301, { Location: "/users" });
                        return res.end();
                    }
                );
            });
        });
    }

    if (route === "/users" && method === "GET") {
        fs.readFile("users.json", (err, data) => {
            if (err) {
                console.log(err);
                return;
            }
            if (data.toString()) {
                const parsedData = JSON.parse(data.toString());

                let list = ``;

                for (const data of parsedData) {
                    list += `<li>${data}</li>`;
                }

                res.setHeader("Content-Type", "text/html");
                res.statusCode = 200;

                res.write(`<div>
                <h1>List of users</h1>
                <ol>
                    ${list}
                </ol>

                <br>
                <br>
                <a href="/create-user">Create a new User</a>
            </div>`);

                return res.end();
            }
            res.setHeader("Content-Type", "text/html");
            res.statusCode = 200;

            res.write(`<div>
                    <h1>List of users</h1>
                    <ol>
                        There are no users
                    </ol>
    
                    <br>
                    <br>
                    <a href="/create-user">Create a new User</a>
                </div>`);

            return res.end();
        });
    }
});
server.listen(3000);
