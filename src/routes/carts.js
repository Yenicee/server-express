const express = require('express');
const fs = require('fs');
const router = express.Router();

// Función para cargar carritos desde el archivo JSON
function loadCartsFromFile() {
    if (fs.existsSync('carts.json')) {
        const data = fs.readFileSync('carts.json', 'utf8');
        return JSON.parse(data);
    }
    return [];
}

// Función para guardar carritos en el archivo JSON
function saveCartsToFile(carts) {
    fs.writeFileSync('carts.json', JSON.stringify(carts, null, 4));
}

// Ruta raíz POST /api/carts
router.post('/', (req, res) => {
    try {
        // Implementa la lógica para crear un nuevo carrito
        const carts = loadCartsFromFile();
        const newCartId = carts.length > 0 ? Math.max(...carts.map(cart => cart.id)) + 1 : 1;
        const newCart = {
            id: newCartId,
            products: []
        };
        carts.push(newCart);
        saveCartsToFile(carts);
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
        // Implementa la lógica para agregar un producto a un carrito
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el producto al carrito' });
    }
});

module.exports = router;
