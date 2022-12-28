const formHtmlString = `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>send message</title>
    </head>
    <body>
        <h3>Add a Product</h3>
        <form action="/admin/add-product" method="POST">
            <input type="text" name="message" />
            <button type="submit">Add product</button>
        </form>
    </body>
</html>`;

module.exports = { formHTML: formHtmlString };
