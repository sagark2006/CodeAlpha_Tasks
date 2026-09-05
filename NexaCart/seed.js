const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("./models/product");

const products = [

    {
        name: "Wireless Headphones",
        description: "Premium wireless headphones with noise cancellation.",
        price: 1999,
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
        stock: 25,
        rating: 4.7,
        reviews: 128
    },

    {
        name: "Smart Watch",
        description: "Smart fitness watch with health tracking.",
        price: 2499,
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
        stock: 18,
        rating: 4.5,
        reviews: 94
    },

    {
        name: "Classic Sneakers",
        description: "Comfortable everyday sneakers.",
        price: 1499,
        category: "Fashion",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
        stock: 40,
        rating: 4.6,
        reviews: 211
    },

    {
        name: "Minimal Backpack",
        description: "Stylish and durable backpack for everyday use.",
        price: 999,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
        stock: 30,
        rating: 4.4,
        reviews: 76
    },

    {
        name: "Gaming Mouse",
        description: "High precision gaming mouse with RGB lighting.",
        price: 1299,
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1527814050087-3793815479db",
        stock: 35,
        rating: 4.8,
        reviews: 156
    },

    {
        name: "Sunglasses",
        description: "Modern UV-protected sunglasses.",
        price: 799,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083",
        stock: 50,
        rating: 4.3,
        reviews: 64
    }

];

const seedDatabase = async () => {

    try {

        await mongoose.connect(process.env.MONGO_URI);

        await Product.deleteMany();

        await Product.insertMany(products);

        console.log("Products added successfully!");

        await mongoose.connection.close();

    } catch (error) {

        console.error(error);

    }

};

seedDatabase();