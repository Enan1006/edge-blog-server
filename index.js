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

        //single blog
        app.get('/post/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await blogCollection.findOne(query);
            res.send(result)
        });

        //my blogs
        app.get('/my-post', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = blogCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)
        })

        //delete blog
        // app.delete('/posts/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const filter = { _id: ObjectId(id) };
        //     const result = await blogCollection.deleteOne(filter);
        //     if (result.deletedCount === 1) {
        //         console.log('Post has deleted with id', id);
        //     }
        //     else {
        //         console.log('Post has already deleted');
        //     }
        //     res.send(result)
        // })

        //filter by category
        app.get('/categories', async (req, res) => {
            const category = req.query.category;
            console.log(category);
            const query = { category: category };
            const cursor = blogCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)
        })
        app.get('/categories/:categoryId', async (req, res) => {
            const category = req.params.categoryId;
            console.log(category);
            const query = { category: category };
            const cursor = blogCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)
        })

    }
    finally { }
}
run().catch(console.dir)



app.listen(port, () => {
    console.log(`Server is running on ${port}`)
})