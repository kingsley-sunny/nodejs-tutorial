const fs = require("fs");

const loginHtmlString = `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>send message</title>
    </head>
    <body>
        <strong>message</strong>
        <form action="/message" method="POST">
            <input type="text" name="message" />
            <button type="submit">send messae</button>
        </form>
    </body>
</html>
`;
const homeHtmlString = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My first Node js response</title>
</head>
<body>
  <h1>This is my First Node js response</h1>
</body>
</html>
`;

const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;

    if (url === "/") {
        res.writeHead(200, { "Content-Type": "text/html" });

        res.write(loginHtmlString);
        return res.end();
    }

    if (req.url === "/message" && method === "POST") {
        const body = [];
        req.on("data", chunk => {
            console.log(chunk);
            body.push(chunk);
        });
        req.on("end", () => {
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split("=")[1];
            fs.writeFile("message.txt", message, err => {
                if (err) {
                    res.writeHead(500, { location: "/" });
                    return res.end();
                }
                res.writeHead(301, { location: "/" });
                return res.end();
                ("hel");
            });
        });
        res.writeHead(301, { location: "/" });
        return res.end();
    }

    // res.setHeader("Content-Type", "text/html");
    // res.statusCode = 200;
    // res.write(homeHtmlString);
    // res.end();
};

module.exports = requestHandler;
