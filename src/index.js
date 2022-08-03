import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";

dotenv.config();

const app = express();

const jsonParser = bodyParser.json();

const urlencodedParser = bodyParser.urlencoded({ extended: true });

app.use(jsonParser);
app.use(urlencodedParser);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(process.env.PORT ?? "3000", () => {
  console.log(`Server is listening to Port ${process.env.PORT}`);
});
