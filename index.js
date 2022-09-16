require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Edge blog server is running')
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lzyeaxn.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const blogCollection = client.db("edgeBlog").collection("posts");
        app.get('/posts', async (req, res) => {
            const query = {};
            const cursor = blogCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)
        });

        app.post('/posts', async (req, res) => {
            const data = req.body;
            const doc = {
                title: data.title,
                description: data.description,
                image: data.image,
                user: data.user,
                email: data.email,
                category: data.category
            };
            const result = await blogCollection.insertOne(doc);
            res.send(result)
        });




    }
    finally { }
}
run().catch(console.dir)



app.listen(port, () => {
    console.log(`Server is running on ${port}`)
})