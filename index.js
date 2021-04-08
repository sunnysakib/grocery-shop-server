const express = require('express')
require('dotenv').config()
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;


const app = express()
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
const port = 5000



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pk8dw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    console.log("connection error", err);
    const productsCollection = client.db("groceryShop").collection("products");
    const ordersCollection = client.db("groceryShop").collection("orders");

    app.get("/products", (req, res) => {
      productsCollection.find()
      .toArray((err, items) => {
        res.send(items);
      })
    })
    
    app.post( "/addProduct", ( req, res ) =>{
        const newProduct = req.body;
       productsCollection.insertOne(newProduct)
        .then(result => {
            console.log(result.insertedCount);
            res.send(result.insertedCount > 0)
        })
    })

    app.delete('/delete/:id', (req, res) => {
      productsCollection.deleteOne({_id: ObjectId(req.params.id)})
      .then(result =>{
        console.log(result);
      })
    })

    app.post('/orders', (req, res)=>{
        const checkoutList = req.body;
        console.log(checkoutList);
        ordersCollection.insertOne(checkoutList)
        .then(result =>{
          res.send(result.insertedCount > 0)
        })
    })

    app.get("/orders", (req, res) => {
      ordersCollection.find()
      .toArray((err, items) => {
        res.send(items);
      })
    })
    })




app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port, () => {
  console.log(`Listening at http://localhost:${port}`)
})