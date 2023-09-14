const express = require('express');
const fs = require('fs');
const productRouter = express.Router();
const ProductManager = require('../managers/ProductManager');
const exphbs = require('express-handlebars');
const { io } = require('../app');

//Configuracion de Handlebars
//productRouter.engine('handlebars', exphbs());
//productRouter.set('view engine', 'handlebars');

//Agrego productoManager 
const productManager = new ProductManager('src/products.json');

//carga de producto desde el archivo
function loadProductsFromFile() {
    if (fs.existsSync('src/products.json')) {
        const data = fs.readFileSync('src/products.json', 'utf8');
        return JSON.parse(data);
    }
    return [];
}

function saveProductsToFile(products) {
    fs.writeFileSync('src/products.json', JSON.stringify(products, null, 4));
}

//Ruta para la vista de home.handlebars
productRouter.get('./home', (req, res) => {
    const products = loadProductsFromFile();
    res.render('home', { products });
});

//Ruta para la vista de realTimesProduct.handlebars
productRouter.get('./realTimesProducts', (req, res) => {
    const products = loadProductsFromFile();
    res.render('realTimesProducts', { products });
});

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

// Ruta POST /api/products
productRouter.post('/', (req, res) => {
    const { title, description, price, code, stock, category } = req.body;
    // Agrego el campo thumbnail como un array vacío si no está definido.
    const thumbnail = req.body.thumbnail || [];
    // Añadir el campo status con el valor predeterminado true.
    const status = true;

    try {
        // Obtener el resultado de la función addProduct.
        const newProduct = productManager.addProduct(
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            category,
            status 
        );
        // Verificar si newProduct es undefined y devolver un 400 si lo es.
        if (!newProduct) {
            return res.status(400).json({ error: 'Error al crear el producto' });
        }

        res.status(201).json({ message: 'Producto creado con éxito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el producto' });
    }
});

// Ruta PUT /api/products/:id
productRouter.put('/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const newData = req.body;
    try {
        const updatedProduct = productManager.updateProduct(productId, newData);
        if (updatedProduct) {
            // Emitir evento de producto actualizado al websocket
            io.emit('productUpdated', updatedProduct);
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
        if (productManager.deleteProduct(productId)) {
            // Emitir evento de producto eliminado al websocket
            io.emit('productDeleted', productId);
            res.json({ message: 'Producto eliminado con éxito' });
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

module.exports = productRouter;