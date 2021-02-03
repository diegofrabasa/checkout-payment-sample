const express = require("express");
const app = express();
const mercadopago = require("mercadopago");

//REPLACE WITH YOUR ACCESS TOKEN AVAILABLE IN: https://developers.mercadopago.com/panel/credentials
mercadopago.configure({
	access_token: 'APP_USR-1025205870342941-020219-842d8de4a96b7a1c617c5945d7756787-710045954',
	integrator_id: 'dev_24c65fb163bf11ea96500242ac130004'
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("../../client"));

app.get("/", function (req, res) {
  	res.status(200).sendFile("index.html");
}); 

app.post("/create_preference", (req, res) => {

	let preference = {
		items: [{
			id:1234,
			"description":"Dispositivo móvil de Tienda e-commerce",
			"currency_id": "MXN",
			"picture_url": "https://www.mercadopago.com/org-img/MP3/home/logomp3.gif",
			title: req.body.description,
			unit_price: Number(req.body.price),
			quantity: Number(req.body.quantity),
		}],
		"payer": {
			"name": "​Lalo",
			"surname": "Landa",
			"email": "test_user_81131286@testuser.com",
			"phone": {
				"area_code": "52",
				"number": 5549737300
			},
			"identification": {
				"type": "DNI",
				"number": "12345678"
			},
			"address": {
				"street_name": "Insurgentes Sur",
				"street_number": 1602,
				"zip_code": "03940"
			}
		},
		back_urls: {
			"success": "/feedback",
			"failure": "/feedback",
			"pending": "/feedback"
		},
		auto_return: 'approved',
		payment_methods: {
			excluded_payment_methods: [
				{
					"id": "amex"
				}
			],
			excluded_payment_types: [
				{
					"id": "atm"
				}
			],
			installments: 6
		},
		"external_reference": "diegofrabasa@gmail.com",
		"notification_url": "https://hookb.in/K3GGwEmwx9F0zzW3VJxn"
	};

	mercadopago.preferences.create(preference)
		.then(function (response) {
			res.json({id :response.body.id})
		}).catch(function (error) {
			console.log(error);
		});
});

app.get('/feedback', function(request, response) {
	 response.json({
		Payment_Id: request.query.payment_id,
		Collection_Id: request.query.collection_id,
		Status: request.query.status,
		Payment_Method_Id: request.query.payment_type,
		External_Reference: request.query.external_reference,
		Merchant_Order_Id: request.query.merchant_order_id,
		Preference_Id: request.query.preference_id,
	})
});

app.listen(8080, () => {
  console.log("The server is now running on Port 8080");
});
