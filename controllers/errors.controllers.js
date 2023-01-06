module.exports.get404Page = (req, res) => {
    res.render("404", { documentTitle: "Page Not Found", path: "*" });
};
