const express = require(`express`);
const formidable = require(`express-formidable`);
const mongoose = require(`mongoose`);
require(`dotenv`).config();

const app = express();
app.use(formidable());

mongoose.connect(process.env.MONGODB_URI);

const userRoutes = require(`./routes/users`);
const offerRoutes = require(`./routes/offer`);

app.use(userRoutes);
app.use(offerRoutes);

app.all(`*`, (req, res) => {
  try {
    res.json({ message: `This route doesn't exist` });
  } catch (error) {
    res.status(400).json(error.message);
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server start, salut`);
});

const test = `test`;
