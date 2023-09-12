const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const productRouter = require('./routes/product');
const cartsRouter = require('./routes/carts');

app.use('/api/products', productRouter);
app.use('/api/carts', cartsRouter);

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});