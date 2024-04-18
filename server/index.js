const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "db_todolistapp",
});

app.get("/all", (req, res) => {
  db.query("SELECT * FROM todolist", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/add", (req, res) => {
  const title = req.body.task;
  const date = req.body.due_date;
  db.query(
    "INSERT INTO TodoList (task, due_date) VALUES(?,?)",
    [title, date],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.put("/update/:id", (req, res) => {
  const newTask = req.body.task;
  const id = req.body.id;
  db.query(
    "UPDATE `TodoList` SET `task`=? WHERE `ID`= ? ",
    [newTask, id],
    (err, results) => {
      if (!results) {
        return res.status(404).json({ message: "No task found!" });
      } else {
        res.send(results);
      }
    }
  );
});

app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM TodoList WHERE id=?", id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.listen(5000, () => {
  console.log("Server is running");
});
