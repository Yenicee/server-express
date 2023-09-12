const express = require('express');
const fs = require('fs');
const router = express.Router();
const CartsManager = require ('../managers/cartManager');

// JSON de carritos
const cartsFilePath = 'src/carts.json';

// YA ACABO DE CREAR UNA INSTANCIA DE CARTMANAGER
const cartsManager = new CartsManager();

// Función para cargar carritos desde el archivo JSON
function loadCartsFromFile() {
    if (fs.existsSync(cartsFilePath)) {
        const data = fs.readFileSync(cartsFilePath, 'utf8');
        return JSON.parse(data);
    }
    return [];
}

// Función para guardar carritos en el archivo JSON
function saveCartsToFile(carts) {
    fs.writeFileSync('src/carts.json', JSON.stringify(carts, null, 4));
}

// Ruta raíz POST /api/carts
router.post('/', (req, res) => {
    try {
        const newCart = cartsManager.createCart();
        const carts = loadCartsFromFile();
        
        res.status(201).json(newCart);
    } catch (error) {
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
        // Validar si el producto existe antes de agregarlo
        const productExists = cart.products.some(item => item.productId === productId);
        if (!productExists) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const productToAdd = {
            productId,
            quantity
        };

        const existingProduct = cart.products.find(item => item.productId === productId);
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push(productToAdd);
        }

        saveCartsToFile(carts);
        res.status(200).json({ message: 'Producto agregado al carrito con éxito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el producto al carrito' });
    }
});

module.exports = router;
