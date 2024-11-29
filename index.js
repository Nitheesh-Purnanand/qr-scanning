const express = require("express");
const app = express();
let port = 3000;
app.set("view engine","ejs")
app.listen(port,()=>{
    console.log(`App is listening at port ${port}`);
})
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
const { v4: uuidv4 } = require('uuid');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('mydatabase.db', (err) => {console.log(err)});
  

let users = []
let users1 =[]
app.get("/",(req,res)=>{
    res.render("home.ejs")
})
app.get("/ig/signin_button",(req,res)=>{
    res.render("signin.ejs");
})
app.get("/ig/signup_button",(req,res)=>{
    res.render("signup.ejs");
})
app.post("/ig/signup",(req,res)=>{
    let a = req.body;
    a.id = uuidv4(); 
    // console.log(a)
    users1.push(a)
    db.run(`INSERT INTO users (id,name, email,password) VALUES ('${a.id}', '${a.name}', '${a.email}', '${a.password}');`);
    res.redirect("index.ejs")
})
app.get("/ig/index.ejs",(req,res)=>{
    db.each(`SELECT * FROM users`, (err, row) => {
        if (!users1.some(user => user.id === row.id)) {
            users1.push(row);
        }
    });


    res.render("index.ejs",{users1})
})
app.get("/ig/view/:id",(req,res)=>{
    let { id } = req.params;
    users1.forEach(element => {
        if (id == element["id"]){
            res.render("view.ejs",{element})
        }
    });
})

app.get("/ig/update/:id",(req,res)=>{
    let { id } = req.params;
    users1.forEach(element => {
        if (id == element["id"]){
            res.render("update.ejs",{element})
        }
    });
})


app.post("/ig/update/:id",(req,res)=>{
    let { id } = req.params;
    let a = req.body;
    users1.forEach(element => {
        if (id == element["id"]){
            element.email = a.email;
            element.password = a.password;
            db.run(`UPDATE users SET email = '${a["email"]}' WHERE id = '${id}';`);
            db.run(`UPDATE users SET password = '${a["password"]}' WHERE id = '${id}';`)
            res.redirect("http://localhost:3000/ig/index.ejs")
        }
    });
}) 

app.get("/ig/users",(req,res)=>{
        db.each(`SELECT * FROM users`, (err, row) => {
            if (!users1.some(user => user.id === row.id)) {
                users1.push(row);
            }
        });
    
    
        res.render("index.ejs",{users1})
})

app.post("/ig/signin", (req, res) => {
    let { email, password } = req.body;
    const query = `SELECT password FROM users WHERE email = ?`;
    db.get(query, [email], (err, row) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).send("Internal Server Error");
        }
        if (!row) {
            return res.status(404).send("User not found");
        }
        if (row.password === password) {
            res.render("landing.ejs");
        } else {
            return res.status(401).send("Invalid credentials")
        }
    });
});
app.get("/ig/qrcode",(req,res)=>{
    res.render("qrcode.ejs")
})
app.post("/ig/new_code",(req,res)=>{
    
    let {email,password} = req.body;

    const query = `SELECT password FROM users WHERE email = ?`;
    db.get(query, [email], (err, row) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).send("Internal Server Error");
        }
        if (!row) {
            return res.status(404).send("User not found");
        }
        if (row.password === password) {
            res.render("new_code.ejs",{password})
        } else {
            return res.status(401).send("Invalid credentials")
        }
    });

})
app.get("/direct",(req,res)=>{
    let email = "chalmuri.nitheesh@gmail.com";
    res.render("scanning.ejs",{email})
})
app.post("/ig/scanning",(req,res)=>{
    let {email} = req.body;
    res.render("scanning.ejs",{email})
})

app.post("/ig/select",(req,res)=>{
    let {morse} = req.body;
    res.render("morse.ejs")
})
