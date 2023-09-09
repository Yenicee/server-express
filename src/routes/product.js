const express = require('express');
const fs = require('fs');
const productRouter = express.Router();  

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

// Ruta POST /api/products
productRouter.post('/', (req, res) => {
    const { title, description, price, thumbnail, code, stock, status, category } = req.body;
    const products = loadProductsFromFile();

    // Validar que todos los campos estén presentes
    if (!title || !description || !price || !thumbnail || !code || !stock || !status || !category) {
        return res.status(400).json({ error: 'Todos los campos deben estar definidos.' });
    }

    // Comprobar si ya existe un producto con el mismo código
    if (products.some(product => product.code === code)) {
        return res.status(400).json({ error: 'Ya existe un producto con el mismo código.' });
    }

    // Agregar un nuevo producto
    const newId = products.length > 0 ? Math.max(...products.map(product => product.id)) + 1 : 1;
    const newProduct = {
        id: newId,
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        status,
        category
    };
    products.push(newProduct);
    saveProductsToFile(products);

    res.status(201).json({ message: 'Producto creado con éxito' });
});

// Ruta PUT /api/products/:id
productRouter.put('/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const newData = req.body;
    const products = loadProductsFromFile();
    const productIndex = products.findIndex(product => product.id === productId);

    if (productIndex !== -1) {
        // Actualizar el producto por ID
        products[productIndex] = { ...products[productIndex], ...newData, id: productId };
        saveProductsToFile(products);
        res.json({ message: 'Producto actualizado con éxito' });
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

// Ruta DELETE /api/products/:id
productRouter.delete('/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const products = loadProductsFromFile();
    const initialLength = products.length;

    // Eliminar el producto por ID
    products = products.filter(product => product.id !== productId);

    if (products.length !== initialLength) {
        saveProductsToFile(products);
        res.json({ message: 'Producto eliminado con éxito' });
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

module.exports = productRouter;
