require('dotenv').config()
const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middle ware
app.use(cors());
app.use(express.json());







const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.k53g2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    // visa collection
    const visaCollection = client.db('visa_DB').collection('visa');
    const appliedVisaCollection = client.db('visa_DB').collection('appliedVisa');




    //create add visa
    app.post('/visa', async (req, res) => {
      const newVisa = req.body;
      console.log(newVisa)
      const result = await visaCollection.insertOne(newVisa);
      res.send(result);
    })

    // read get visa
    app.get('/visa', async (req, res) => {
      const cursor = visaCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    
    // deleting one data
    app.delete('/visa/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id) };
      const result = await visaCollection.deleteOne(query);
      res.send(result);
    })

    // create applied visa
    app.post('/appliedVisa',async(req,res)=>{
      const newAppliedVisa = req.body;
      const result = await appliedVisaCollection.insertOne(newAppliedVisa);
      res.send(result);
    })

    // get data for applied visa
    app.get('/appliedVisa',async(req,res)=>{
      const cursor = appliedVisaCollection.find();
      const result=await cursor.toArray();
      res.send(result);

    })

    // delete data from applied visa
    app.delete('/appliedVisa/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result =await appliedVisaCollection.deleteOne(query);
      res.send(result);
    })

    // get latest 6 visa 
    app.get('/latestVisa', async (req, res) => {

      const cursor = visaCollection.find().sort({ _id: -1 }).limit(6); 
      const result = await cursor.toArray();
      res.send(result);

    });



    // get one data by id
    app.get('/visa/:id', async (req, res) => {
      const id = req.params.id;
      const result = await visaCollection.findOne({ _id: new ObjectId(id) });
      res.send(result)
    })

    // updating one
    app.put('/visa/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedVisa = req.body;
      const uVisa = {
        $set: {
          countryImage: updatedVisa.countryImage,
          countryName: updatedVisa.countryName,
          visaType: updatedVisa.visaType,
          processingTime: updatedVisa.processingTime,
          requiredDocuments: updatedVisa.requiredDocuments,
          description: updatedVisa.description,
          ageRestriction: updatedVisa.ageRestriction,
          fee: updatedVisa.fee,
          validity: updatedVisa.validity,
          applicationMethod: updatedVisa.applicationMethod,

        }
      }
      const result = await visaCollection.updateOne(filter, uVisa);
      res.send(result);
    })






    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('visa navigation portal is running')
})

app.listen(port, () => {
  console.log(`visa navigation portal server is running in`, port);
})
