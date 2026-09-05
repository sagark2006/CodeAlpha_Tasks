const express = require("express");
const path = require("path");
require("dotenv").config();
const productRoutes = require("./routes/productRoutes");

const connectDB = require("./config/db");

const app = express();
const session = require("express-session");
const {MongoStore} = require("connect-mongo");

// Connect Database
connectDB();

// EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Product Routes
app.use("/products", productRoutes);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,

        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI
        }),

        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7
        }
    })
);

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Home
app.get("/", (req, res) => {
    res.render("home");
});
app.get("/cart", async (req, res) => {

    try {

        const cart = req.session.cart || [];

        const cartItems = [];

        for (const item of cart) {

            const product = await Product.findById(
                item.productId
            );

            if (product) {

                cartItems.push({
                    product,
                    quantity: item.quantity,
                    subtotal: product.price * item.quantity
                });

            }

        }

        const total = cartItems.reduce(
            (sum, item) => sum + item.subtotal,
            0
        );

        res.render("cart", {
            cartItems,
            total
        });

    } catch (error) {

        console.error(error);

        res.status(500).send("Server Error");

    }

});

app.post("/add/:id", async (req, res) => {

    try {

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).send("Product not found");
        }

        const quantity = parseInt(req.body.quantity) || 1;

        if (quantity > product.stock) {
            return res.status(400).send("Not enough stock");
        }

        if (!req.session.cart) {
            req.session.cart = [];
        }

        const existingProduct = req.session.cart.find(
            item => item.productId === product._id.toString()
        );

        if (existingProduct) {

            existingProduct.quantity += quantity;

        } else {

            req.session.cart.push({
                productId: product._id.toString(),
                quantity: quantity
            });

        }

        res.redirect("/cart");

    } catch (error) {

        console.error(error);

        res.status(500).send("Server Error");

    }

});
app.post("/remove/:id", (req, res) => {

    if (!req.session.cart) {
        return res.redirect("/cart");
    }

    req.session.cart = req.session.cart.filter(
        item => item.productId !== req.params.id
    );

    res.redirect("/cart");

});

app.post("/update/:id", async (req, res) => {

    try {

        const quantity = parseInt(req.body.quantity);

        if (quantity <= 0) {
            return res.redirect("/cart");
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).send("Product not found");
        }

        if (quantity > product.stock) {
            return res.status(400).send("Not enough stock");
        }

        const item = req.session.cart.find(
            item => item.productId === req.params.id
        );

        if (item) {
            item.quantity = quantity;
        }

        res.redirect("/cart");

    } catch (error) {

        console.error(error);

        res.status(500).send("Server Error");

    }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`NexaCart running on http://localhost:${PORT}`);
});