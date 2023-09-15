const express = require('express');
const fs = require('fs');
const router = express.Router();
const CartsManager = require('../managers/cartManager');

// Ruta del archivo JSON de carritos
const cartsFilePath = 'src/carts.json';

// Crear una instancia de CartsManager
const cartsManager = new CartsManager();

// Función para cargar la lista de carritos desde el archivo.
function loadCartsFromFile() {
    try {
        const data = fs.readFileSync(cartsFilePath, 'utf8'); 
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al cargar los carritos desde el archivo', error);
        return [];
    }
}

// Función para guardar la lista de carritos en el archivo.
function saveCartsToFile(carts) {
    try {
        fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2), 'utf8'); 
    } catch (error) {
        console.error('Error al guardar los carritos en el archivo', error);
    }
}

// Ruta raíz POST /api/carts
router.post('/', (req, res) => {
    try {
        const carts = loadCartsFromFile();
        // Verificar si ya existe un carrito con el mismo ID
        const newCartId = carts.reduce((maxId, cart) => Math.max(maxId, cart.id), 0) + 1;
        const newCart = cartsManager.createCart(newCartId);

        carts.push(newCart);
        saveCartsToFile(carts);

        res.status(201).json(newCart);
    } catch (error) {
        console.error('Error al crear el carrito', error);
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
});

// Ruta GET /api/carts/:cid
router.get('/:cid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    try {
        const carts = loadCartsFromFile();
        const cart = carts.find(cart => cart.id === cartId);

        if (cart) {
            res.json(cart);
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener el carrito', error);
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
});

// Ruta POST /api/carts/:cid/product/:pid
router.post('/:cid/product/:pid', (req, res) => {
    try {
        const carts = loadCartsFromFile();
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);
        const quantity = parseInt(req.body.quantity);

        const cart = carts.find(cart => cart.id === cartId);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        // Cargar la lista de productos desde el archivo
        const products = loadProductsFromFile();
        const product = products.find(product => product.id === productId);

        if (!product) {
            return res.status(400).json({ error: 'Producto no encontrado' });
        }

        const productExists = cart.products.some(item => item.productId === productId);
        if (!productExists) {
            return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
        }

        const existingProduct = cart.products.find(item => item.productId === productId);
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ productId, quantity });
        }

        saveCartsToFile(carts);
        res.status(200).json({ message: 'Producto agregado al carrito con éxito' });
    } catch (error) {
        console.error('Error al agregar el producto al carrito', error);
        res.status(500).json({ error: 'Error al agregar el producto al carrito' });
    }
});

module.exports = router;
