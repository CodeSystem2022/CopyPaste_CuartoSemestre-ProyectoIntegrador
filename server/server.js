const express = require("express");
const app = express();
const cors = require("cors");
const mercadopago = require("mercadopago");
const path = require("path");

// REPLACE WITH YOUR ACCESS TOKEN AVAILABLE IN: https://developers.mercadopago.com/panel
mercadopago.configure({
    access_token: "APP_USR-8005534317430798-091718-b982966f21e5ad67337aec6868ccafbb-1483636744",
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json()); //para que pueda leer archivos .json
app.use(express.static(path.join(__dirname, "../client")));
app.use(cors());

//inicializa una primer ruta vacía "/"
app.get("/", function () {
   path.resolve(__dirname, "..", "client", "index.html");
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