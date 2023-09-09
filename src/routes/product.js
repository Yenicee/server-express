const express = require('express');
const fs = require('fs');
const productRouter = express.Router();
const ProductManager = require('../managers/ProductManager');

//Agrego productoManager 
const productManager = new ProductManager('src/products.json');

//Agrego la ruta para mostrar la vista de "home"
productRouter.get('/views/home', (req, res) => {
    const products = loadProductsFromFile();
    res.render('home', { products });
});

//Agrego ruta para mostrar "realProducts"
productRouter.get('/views/realProducts', (req, res) => {
    const products = loadProductsFromFile();
    res.render('realProducts', { products });
});

// Función para cargar productos desde el archivo JSON
function loadProductsFromFile() {
    if (fs.existsSync('src/products.json')) {
        const data = fs.readFileSync('src/products.json', 'utf8');
        return JSON.parse(data);
    }
    return [];
}

// Función para guardar productos en el archivo JSON
function saveProductsToFile(products) {
    fs.writeFileSync('src/products.json', JSON.stringify(products, null, 4));
}

// Ruta raíz GET /api/products
productRouter.get('/', (req, res) => {
    const limit = parseInt(req.query.limit);
    const products = loadProductsFromFile();

    if (!isNaN(limit) && limit > 0) {
        res.json(products.slice(0, limit));
    } else {
        res.json(products);
    }
});

// Ruta GET /api/products/:id
productRouter.get('/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const products = loadProductsFromFile();
    const product = products.find(product => product.id === productId);

    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

// Ruta PUT /api/products/:id
productRouter.put('/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const newData = req.body;

    try {
        // Utiliza el método updateProduct de productManager
        if (productManager.updateProduct(productId, newData)) {
            // Actualización exitosa
            res.json({ message: 'Producto actualizado con éxito' });
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

// Ruta DELETE /api/products/:id
productRouter.delete('/:id', (req, res) => {
    const productId = parseInt(req.params.id);

    try {
        // Utiliza el método deleteProduct de productManager
        if (productManager.deleteProduct(productId)) {
           //comentado esto para la proxima entrega
            // io.emit('updateProducts', products);
            res.json({ message: 'Producto eliminado con éxito' });
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});


module.exports = productRouter;
