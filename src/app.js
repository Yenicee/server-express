const express = require('express');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');
const productRouter = require('../src/products.json');
const cartsRouter = require('../carts.json'); 

app.use(bodyParser.json());
app.use('/api/products', productRouter);
app.use('/api/carts', cartsRouter);

class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
        this.loadData();
    }

    loadData() {
        if (fs.existsSync(this.path)) {
            const data = fs.readFileSync(this.path, 'utf8');
            this.products = JSON.parse(data);
        }
    }

    saveData() {
        fs.writeFileSync(this.path, JSON.stringify(this.products, null, 4));
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log('Todos los campos deben estar definidos.');
            return;
        }

        if (this.products.some(product => product.code === code)) {
            console.log('Ya existe un producto con el mismo código.');
            return;
        }

        const newId = this.generateUniqueId();
        const newProduct = {
            id: newId,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        };
        this.products.push(newProduct);
        this.saveData();
    }

    generateUniqueId() {
        let newId = this.products.length + 1;
        while (this.products.some(product => product.id === newId)) {
            newId++;
        }
        return newId;
    }

    getProduct(productId) {
        return this.products.find(product => product.id === productId);
    }

    updateProduct(productId, newData) {
        const productIndex = this.products.findIndex(product => product.id === productId);
        if (productIndex !== -1) {
            this.products[productIndex] = { ...this.products[productIndex], ...newData, id: productId };
            this.saveData();
            return true;
        }
        return false;
    }

    deleteProduct(productId) {
        const initialLength = this.products.length;
        this.products = this.products.filter(product => product.id !== productId);
        if (this.products.length !== initialLength) {
            this.saveData();
            return true;
        }
        return false;
    }
}

const productManager = new ProductManager('products.json');

// Definir rutas para productos
const productsRouter = express.Router();

// GET /api/products
productsRouter.get('/', (req, res) => {
    const limit = parseInt(req.query.limit);
    const products = productManager.products;

    if (!isNaN(limit) && limit > 0) {
        res.json(products.slice(0, limit));
    } else {
        res.json(products);
    }
});

// GET /api/products/:id
productsRouter.get('/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = productManager.getProduct(productId);

    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

// POST /api/products
productsRouter.post('/', (req, res) => {
    const { title, description, price, thumbnail, code, stock } = req.body;
    productManager.addProduct(title, description, price, thumbnail, code, stock);
    res.status(201).json({ message: 'Producto creado con éxito' });
});

// PUT /api/products/:id
productsRouter.put('/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const newData = req.body;
    const updated = productManager.updateProduct(productId, newData);
    
    if (updated) {
        res.json({ message: 'Producto actualizado con éxito' });
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

// DELETE /api/products/:id
productsRouter.delete('/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const deleted = productManager.deleteProduct(productId);

    if (deleted) {
        res.json({ message: 'Producto eliminado con éxito' });
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

// Muestra el enrutador de productos en /api/products
app.use('/api/products', productsRouter);
const cartsRouter = express.Router();

// POST /api/carts
cartsRouter.post('/', (req, res) => {
    // Implementa la lógica para crear un nuevo carrito
});

// GET /api/carts/:cid
cartsRouter.get('/:cid', (req, res) => {
    // Implementa la lógica para listar productos en un carrito por CID
});

// POST /api/carts/:cid/product/:pid
cartsRouter.post('/:cid/product/:pid', (req, res) => {
    // Implementa aca la lógica para agregar un producto a un carrito
});

// Montar el enrutador de carritos en /api/carts
app.use('/api/carts', cartsRouter);

const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
