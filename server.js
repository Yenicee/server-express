const express = require('express');
const app = express();

//ejemplo de productos 
const products = [
  { id: 1, name: 'LG Gram 15Z90Q' },
  { id: 2, name: 'iPad Pro' },
  { id: 3, name: 'Acer Chromebook 314 CB314-2H' },
  { id: 4, name: 'ASUS Vivo AiO' },
  { id: 5, name: 'MSI mag Meta S 3SI-019XEU' },
  { id: 6, name: 'Xiaomi Pad 5' },
  { id: 7, name: 'Lenovo D24-20' },
  { id: 8, name: 'Microsoft Sculpt Ergonomi' },
  { id: 9, name: 'Satechi Ratón M1' },
  { id: 10, name: 'Mando Xbox Robot White' },
];

// Ruta para obtener todos los productos o productos limitados
app.get('/products', (req, res) => {
  const limit = parseInt(req.query.limit);
  
  if (!isNaN(limit) && limit > 0) {
    res.json(products.slice(0, limit));
  } else {
    res.json(products);
  }
});

// Ruta para obtener un producto por ID
app.get('/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find(p => p.id === productId);
  
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// Iniciar el servidor en el puerto 8080
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
