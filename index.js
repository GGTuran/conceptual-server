const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require("cors");
require('dotenv').config();

const app = express();
// middleware

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vddbb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// console.log(uri)

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
    client.connect();


    const userCollection = client.db('userDB').collection("users");


    // create method

    app.post('/users', async (req,res)=>{
        const user = req.body;
        const result = await userCollection.insertOne(user);
        console.log(result);
        res.send(result);
    });

    // read
    // app.get("/users", async (req, res)=>{
    //     const result = await userCollection.find().toArray();
    //     // console.log(result)
    // })

    app.get("/users", async(req, res) =>{
      const result = await userCollection.find().toArray();
      console.log(result);
      res.send(result);
    })

    // get a single data 

    app.get("/users/:id", async(req, res) =>{
      const id = req.params.id;
      console.log(id);
      const query = {_id: new ObjectId(id)};
      const result = await userCollection.findOne(query);
      res.send(result);
    })

    // update single data


    app.put("/users/:id", async(req, res) =>{
      const id = req.params.id;
      const data = req.body;
      const filter = {_id: new ObjectId(id)};
      const options = { upsert: true };
      const updatedData = {
        $set: {
          name: data.name,
          email: data.email,
          password: data.password,
        },
      };
      const result = await userCollection.updateOne(filter, updatedData, options);
      res.send(result);
    })





    
    // delete

    app.delete("/users/:id", async(req, res) =>{
      const id = req.params.id;
      console.log(id);
      const query = {_id: new ObjectId(id)};
      const result = await userCollection.deleteOne(query);
      res.send(result);
    })






    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) =>{
    res.send('Conceptual Session going on');
});

app.listen(port , () =>{
    console.log(`Server should run at PORT : ${port}`);
});




// /