const express = require("express");
const router = express.Router();

const Product = require("../models/Product");

// All products
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();

        res.render("products", {
            products
        });

    } catch (error) {
        console.error(error);

        res.status(500).send("Server Error");
    }
});

// Single product
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).send("Product not found");
        }

        res.render("product-details", {
            product
        });

    } catch (error) {
        res.status(500).send("Server Error");
    }
});

module.exports = router;