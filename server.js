const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");

const Admin = require("./backend/models/Admin");
const Service = require("./backend/models/Service");

const app = express();
const PORT = 3000;

// Connect MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/financeApp", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log(err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
  secret: "secretKey123",
  resave: false,
  saveUninitialized: true
}));

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.get("/", async (req, res) => {
  const services = await Service.find();
  res.render("index", { services });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });

  if (admin && bcrypt.compareSync(password, admin.passwordHash)) {
    req.session.user = username;
    res.redirect("/admin");
  } else {
    res.send("<h2>❌ Invalid credentials</h2><a href='/login'>Try again</a>");
  }
});

app.get("/admin", async (req, res) => {
  if (!req.session.user) return res.redirect("/login");

  const services = await Service.find();
  let serviceList = services.map(s => `<li>${s.name} - ${s.description}</li>`).join("");

  res.send(`
    <h1>Admin Dashboard</h1>
    <h3>Welcome, ${req.session.user}</h3>
    <form action="/add-service" method="POST">
      <input type="text" name="name" placeholder="Service Name" required>
      <input type="text" name="description" placeholder="Service Description" required>
      <button type="submit">Add Service</button>
    </form>
    <h2>Services List</h2>
    <ul>${serviceList}</ul>
    <br><a href="/logout">Logout</a>
  `);
});

app.post("/add-service", async (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  const { name, description } = req.body;
  const service = new Service({ name, description });
  await service.save();
  res.redirect("/admin");
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
