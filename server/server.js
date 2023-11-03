const express = require("express");
const app = express();
const cors = require("cors");
const mercadopago = require("mercadopago");
const path = require("path");
const { Pool } = require('pg');

// Configuración de la conexión a la base de datos PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'verduleria', 
    password: 'postgres',
    port: 5432,
});

// Configuración de mercadoPago
mercadopago.configure({
    access_token: "TEST-9004424593507134-091521-ea1d59107b1ffab96f224c7c84a44823-17406307",
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json()); //para que pueda leer archivos .json
app.use(express.static(path.join(__dirname, "../client")));
app.use(cors());

//inicializa una primer ruta vacía "/"
app.get("/", function () {
   path.resolve(__dirname, "..", "client", "index.html");
});

//Solicitud de todos los productos a la base de datos de PostgreSQL
app.get("/productos", (req, res) => {
    pool.query('SELECT * FROM productos', (error, result) => {
        if (error) {
            console.error('Error al obtener productos', error);
            res.status(500).json({ error: 'Error al obtener productos' });
        } else {
            const productos = result.rows;
            res.json(productos);
        }
    });
});

//Solicitud de un producto segun id a la base de datos de PostgreSQL
app.get("/productos/:id", (req, res) => {
    const productId = req.params.id;
    pool.query('SELECT * FROM productos WHERE id = $1', [productId], (error, result) => {
        if (error) {
            console.error('Error al obtener el producto', error);
            res.status(500).json({ error: 'Error al obtener el producto' });
        } else {
            const producto = result.rows[0];
            res.json(producto);
        }
    });
});

app.post("/create_preference", (req, res) => {

    let preference = {
        items: [
            {
                title: req.body.description, //título
                unit_price: Number(req.body.price), //precio y desde donde lo trae
                quantity: Number(req.body.quantity), //cantidad
            }
        ],
        back_urls: {
            "success": "http://localhost:8080",
            "failure": "http://localhost:8080",
            "pending": ""
        },
        auto_return: "approved",
    };

    mercadopago.preferences.create(preference)
        .then(function (response) {
            res.json({
                id: response.body.id
            });
        })
        .catch(function (error) {
        console.log(error);
    });
});

app.get('/feedback', function (req, res) {
    res.json({
        Payment: req.query.payment_id,
        Status: req.query.status,
        MerchantOrder: req.query.merchant_order_id
    });
});

app.listen(8080, () => {
    console.log("The server is now running on Port 8080");
});