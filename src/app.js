const express = require('express');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');

const productRouter = require('./routes/product'); 
const cartsRouter = require('./routes/carts'); 

app.use(bodyParser.json());

// Monta los enrutadores en sus rutas respectivas
app.use('/api/products', productRouter);
app.use('/api/carts', cartsRouter);

const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
