require('dotenv').config();
const app = require('./generated/server/nodejs-express/app');

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`AGRI-NEST API stub listening on http://localhost:${port}`));
