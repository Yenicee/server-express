const express = require('express');
const fs = require('fs');
const app = express();

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

// Agregamos un producto 
productManager.addProduct('Impresion 3D', 'Consola de 3D', 800, 'imagen1.jpg', 'P1', 5);

const PORT = 8080;

app.get('/products', (req, res) => {
    const limit = parseInt(req.query.limit);
    const products = productManager.products;

    if (!isNaN(limit) && limit > 0) {
        res.json(products.slice(0, limit));
    } else {
        res.json(products);
    }
});

app.get('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = productManager.getProduct(productId);

    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
