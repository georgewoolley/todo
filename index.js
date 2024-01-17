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
 
  
  try {
  const result = await db.query("SELECT * FROM items ORDER BY id ASC");

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

app.post("/edit", async (req, res) => {

  const updatedItemId = req.body.updatedItemId;
  const updatedItemTitle = req.body.updatedItemTitle;

  try {
    await db.query("UPDATE items SET title = ($1) WHERE id = $2", [updatedItemTitle, updatedItemId]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }



});

app.post("/delete", async (req, res) => {

  const deltedItemId = req.body.deleteItemId;
 
  try {
    await db.query("DELETE FROM items WHERE id = $1", [deltedItemId]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }




});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

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
