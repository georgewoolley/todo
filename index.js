import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "Sparkey16!",
  port: 5433,
});

db.connect();

let items = [];

let items_old = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async (req, res) => {
 
  
 // fetchData();

 try {
  const result = await db.query("SELECT * from items");

    const data = result.rows;
    items = data;
  

} catch (err) {
  console.log(err);
}


  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  console.log("Item is:" +item);
 // items.push({ title: item });
  //postData(item);

  try {
    await db.query(
      "INSERT INTO items (title) VALUES ($1)",
      [item]
    );
 
  } catch (err) {
    console.log(err);
  }
  res.redirect("/");


  
});

app.post("/edit", (req, res) => {});

app.post("/delete", (req, res) => {});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


async function fetchData() {
  try {
    const result = await db.query("SELECT * from items");
  
    if (result && result.rows && result.rows.length > 0) {
      const data = result.rows;
      console.log(data);
      items = data;
    } else {
      console.log("No rows found");
    }
  
  } catch (err) {
    console.log(err);
  }
  return items
} 

async function postData(dataToPost) {

  try {
    await db.query(
      "INSERT INTO items (title) VALUES ($1)",
      [dataToPost]
    );
    
  } catch (err) {
    console.log(err);
  }
  res.redirect("/");

}
