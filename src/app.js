const express = require('express');
const app = express();
const http = require("http");
const server = http.createServer(app);
const ProductManager = require("./managers/ProductManager");
const productRouter = require('./routes/product');
const cartsRouter = require('./routes/carts');
const { Server } = require("socket.io");
const io = new Server(server);
let products = [];

const handlebars = require("express-handlebars");
//app.engine("handlebars", handlebars());
app.set("views", __dirname + "/views");
app.set("images", __dirname + "/images");
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({extended:true}));



app.use('/api/products', productRouter);
app.use('/api/carts', cartsRouter);

io.on("connection", (socket) => {
  console.log("Cliente conectado");
  // Inicialmente, busco los productos en el archivo y los envío por socket
  const productManager = new ProductManager("./products.json");
  productManager
    .getProducts()
    .then((products) => {
      productos = products;
      socket.emit("productos", productos);
    })
    .catch((err) => socket.emit("estado", err));
  // Escucho cuando se crea un nuevo producto, actualizo el archivo y vuelvo a enviar los productos ya con el nuevo cargado
  socket.on("new-product", (data) => {
    const productManager = new ProductManager("./products.json");
    productManager
      .addProduct(
        data.title,
        data.description,
        data.code,
        data.price,
        true,
        data.stock,
        data.category,
        []
      )
      .then((estado) => {
        // Envío el estado de la operación a una etiqueta <em> ubicada debajo del botón de Cargar Productos
        socket.emit("estado", estado);
        productManager
          .getProducts()
          .then((products) => {
            productos = products;
          })
          .catch((err) => socket.emit("estado", err));
      })
      .catch((err) => socket.emit("estado", err));
    io.sockets.emit("productos", products); 
  });
  // Escucho cuando se presiona en eliminar producto, lo elimino del archivo y vuelvo a enviar la lista de productos
  socket.on("delete-product", (id) => {
    const productManager = new ProductManager("./products.json");
    productManager
      .deleteProduct(id)
      .then((estado) => {
        // Envío el estado de la operación a una etiqueta <em> ubicada debajo del botón de Cargar Productos
        socket.emit("estado", estado);
        productManager
          .getProducts()
          .then((products) => {
            productos = products;
          })
          .catch((err) => socket.emit("estado", err));
      })
      .catch((err) => socket.emit("estado", err));
    io.sockets.emit("productos", products);
  });
});

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  const productManager = new ProductManager("./products.json");
  productManager
    .getProducts()
    .then((products) => {
      let data = {
        productos: products,
      };
      res.render("index", data);
    })
    .catch((err) => res.status(500).send({ error: "server error" }));
});

server.listen(8080, () => {
  console.log("Server running on port 8080");
});