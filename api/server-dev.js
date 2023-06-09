const express = require('express');
const app = express();
const cors = require('cors');
const itemRoutes = require('./routes/itemRoutes');
const poolRoutes = require('./routes/poolRoutes');
const rentRoutes = require('./routes/rentRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const { sxtAuthenticate } = require('./helpers/sxtAuth');
require('dotenv').config();
const serverless = require('serverless-http');

app.options('*', cors())
app.use(cors())
app.use(express.json())
app.use(async (req, res, next) => {
  try {
    const authData = await sxtAuthenticate();
    req.accessToken = authData.accessToken;
    next();
  } catch (error) {
    res.status(500).send('Failed to authenticate with SxT API');
  }
});
app.use('/items', itemRoutes);
app.use('/pools', poolRoutes);
app.use('/rents', rentRoutes);
app.use('/recommendations', recommendationRoutes);

//to test locally you can use the code below
app.listen(process.env.PORT || 80, () => {
  console.log('Server is running on port 80');
});
