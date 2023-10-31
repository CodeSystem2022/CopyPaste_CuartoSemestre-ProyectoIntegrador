const express = require("express"); //express: framework para node js
const app = express(); //esta constante inicializa express
const cors = require("cors"); //medida de seguridad para navegadores
const mercadopago = require("mercadopago");
const path = require("path"); //Direccion a los directorios necesarios para arrancar el servidor

// REPLACE WITH YOUR ACCESS TOKEN AVAILABLE IN: https://developers.mercadopago.com/panel
mercadopago.configure({
    access_token: "<ACCESS_TOKEN>", //las creamos desde mercado pago después
});


app.use(express.urlencoded({ extended: false }));
app.use(express.json()); //para que pueda leer archivos .json
app.use(express.static(path.join(__dirname, "../../client"))); //no redirige a este archivo estático
app.use(cors());

//inicializa una primer ruta vacía "/"
app.get("/", function () {
    path.resolve(__dirname,"..", "client", "index.html");
});

//al mandar desde el front-end los datos de una compra, se crea una preferencia
app.post("/create_preference", (req, res) => {

    let preference = {
        items: [ //con determinados items
            {
                title: req.body.description, //título
                unit_price: Number(req.body.price), //precio y desde donde lo trae
                quantity: Number(req.body.quantity), //cantidad
            }
        ],
        back_urls: {
            "success": "http://localhost:8080", //si la compra se realizó con éxito, redirige al servidor localhost:8080
            "failure": "http://localhost:8080", //si falla, volvemos a la página principal
            "pending": "" //si está pendiente queda en blanco, NO lo usaremos
        },
        auto_return: "approved", //te retorna al servidor
    };

    mercadopago.preferences.create(preference)
        .then(function (response) {
            res.json({ //se manda al back-end la respuesta en formato json
                id: response.body.id //se genera un ID para esa compra que se generó en el front-end
            }); //ese id mostrará la información de la compra en la pasarela de pago
        }).catch(function (error) { //usamos catch para manejo de errores
        console.log(error);
    });
});

//CONFIGURACIONES AVANZADAS SOBRE EL ESTADO DEL PAGO -> NO LAS USAREMOS
app.get('/feedback', function (req, res) { //para dar mas feedback en caso de configurar mas cosas en mercado pago
    res.json({
        Payment: req.query.payment_id, //seguir el estado del pago
        Status: req.query.status, //seguir el estado de la compra
        MerchantOrder: req.query.merchant_order_id
    });
});

app.listen(8080, () => { //ESCUCHA EL SERVIDOR EN EL PUERTO 8080
    console.log("The server is now running on Port 8080");
});