const express = require("express"); //include express in this app
const path = require("path"); //module to help woth file paths
const { MongoClient, ObjectId } = require("mongodb");
const dbUrl = "mongodb+srv://shopdbuser:FGwS8tWPsqPpGYzq@cluster0.fshqkc4.mongodb.net/";
//const dbUrl = "mongodb://localhost:27017";
const client = new MongoClient(dbUrl);
const app = express(); // create an Express app
const port = process.env.PORT || "8888";

//SET UP TEMPLATE ENGINE
app.set("views", path.join(__dirname, "views")); //set up  "views" setting to look in the <__dirname>/views folder
app.set("view engine", "pug"); //set an app to use Pug as template engine

//SET UP A PATH FOR STATIC FILES
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//SET UP SOME PAGE ROUTES
app.get("/", async(request, response) => {
    let links = await getLinks();
    response.render("index", { title: "Home" , menu: links});
});

app.get("/shop", async (request, response) => {
    let links = await getLinks();
    response.render("shop", { title: "Shop", menu: links });
});

app.get("/shop/add-product", async (request, response) => {
    let links = await getLinks();
    response.render("add-product", { title: "Add Product", menu: links });
});

app.post("/shop/add-product/submit", async (request, response) => {

    let name = request.body.name;
    let price = request.body.price;
    let imageFilename = request.body.imageUrl;
    let imagePath = `/images/${imageFilename}`;
    //console.log(wgt);
    let newLink = {
        "name": name,
        "price": price,
        "imageUrl": imagePath
    };
    await addLink(newLink);
    response.redirect("/shop");
})
app.get("/about", (request, response) => {
    response.render("about", { title: "About" });
});

//Port Listening
app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`)
});

//Mongodb functions
async function connection() {
    db = client.db("shopdb");
    return db;
}

async function getLinks() {
    db = await connection();
    let results = db.collection("shopdata").find({});
    let res = await results.toArray();
    return res;
}

async function addLink(linkData) {
    db = await connection();
    let status = await db.collection("shopdata").insertOne(linkData);
    console.log(linkData);
}
