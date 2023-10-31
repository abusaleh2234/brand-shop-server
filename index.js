const express = require('express');
const cors = require('cors');
require('dotenv').config()
// const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.kothmtv.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection

    const brandsCollection = client.db("brandsDB").collection("brands")
    const productsCollection = client.db("brandsDB").collection("productsItem")
    const myCardCollection = client.db("brandsDB").collection("myCard")
    // const movies = database.collection("movies");

    app.get("/brands", async (req, res) => {
      const censor = brandsCollection.find();
      const result = await censor.toArray();
      res.send(result)
    })
    app.get("/productsItem/:name", async (req, res) => {
      const name = req.params.name;
      const query = { brandName: name };
      const censor = productsCollection.find(query);
      const result = await censor.toArray();
      res.send(result)
    })
    app.get("/productDetails/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const censor = productsCollection.findOne(query);
      const result = await censor;
      res.send(result)
    })
    app.get("/updateProduct/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const censor = productsCollection.findOne(query);
      const result = await censor;
      res.send(result)
    })
    app.get("/addCart", async (req, res) => {
      const censor = myCardCollection.find();
      const result = await censor.toArray();
      res.send(result)
    })
    app.post("/addProduct", async (req, res) => {
      const Product = req.body
      const result = await productsCollection.insertOne(Product);
      res.send(result)

    })
    app.post("/addCart", async (req, res) => {
      const cardProduct = req.body
      const result = await myCardCollection.insertOne(cardProduct);
      res.send(result)

    })
    app.put("/updateProduct/:id", async (req, res) => {
      const id = req.params.id
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const product = req.body
      console.log(product);
      const updateProduct = {
        $set: {
          name: product.name,
          brandName: product.brandName,
          image: product.imageUrl,
          rating: product.rating,
          price: product.price,
          type: product.type,
          details: product.details
        },
      }
      const result = await productsCollection.updateOne(filter, updateProduct, options);
      res.send(result)
    })
    app.delete("/addCart/:id",async (req,res) => {
      const id = req.params.id
      const query = {_id: id}
      const result = await myCardCollection.deleteOne(query)
      res.send(result)
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get("/", (req, res) => {
  res.send("brand shop server hes runing")
})

app.listen(port, () => {
  console.log(`brand shop server is runing to port ${port}`)
})
