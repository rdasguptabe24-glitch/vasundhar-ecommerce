const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("Home");
});

app.get("/products", (req, res) => {
    res.send("Products route works!");
});

app.listen(4000, () => {
    console.log("Test server running on http://localhost:4000");
});