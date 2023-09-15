const fs = require('fs');

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

    addProduct(title, description, price, thumbnail, code, stock, status, category) {
        if (!title || !description || !price || !thumbnail || !code || !stock || !status  || !category) {
            console.log('Todos los campos deben estar definidos.');
            return false;
        }

        if (this.products.some(product => product.code === code)) {
            console.log('Ya existe un producto con el mismo código.');
            return false;
        }

        const newId = this.generateUniqueId();
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
        this.products.push(newProduct);
        this.saveData();

        return true;
        
    }


    generateUniqueId() {
        let newId = this.products.length + 1;
        while (this.products.some(product => product.id === newId)) {
            newId++;
        }
        return newId;
    }

    getProducts() {
        return this.products;
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

// Consultar un producto como lo vamos hacer
const productId = 1;
const product = productManager.getProduct(productId);
if (product) {
    console.log('Producto encontrado:');
    console.log(product);
} else {
    console.log('Producto no encontrado.');
}

// Modificar un producto
const updatedData = {
    price: 800,
    stock: 5
};
if (productManager.updateProduct(productId, updatedData)) {
    console.log('Producto actualizado.');
} else {
    console.log('Producto no encontrado para actualizar.');
}

// Eliminar un producto
if (productManager.deleteProduct(productId)) {
    console.log('Producto eliminado.');
} else {
    console.log('Producto no encontrado para eliminar.');
}

module.exports = ProductManager;