require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const nodeCache = require('node-cache');
const app = express();
const cache = new nodeCache({ stdTTL: 20000, checkperiod: 20000 } );

app.use(cors());
app.use(express.json());

app.all('*', async (req, res) => {

  const [recipientServiceName, ...serviceQuery] = req.originalUrl.slice(1).split('/');
  const recipientServiceURL = process.env[recipientServiceName.toUpperCase()];
  const recipientServiceMethod = req.method;
  const cacheKey = `${recipientServiceMethod}/${recipientServiceName}/${serviceQuery}`
  console.log('START: ', cacheKey)

if (!recipientServiceURL) {
  res.status(502).json({ error: 'Cannot process request' });
  return;
}
const inCache = cache.get(cacheKey)
if(!!inCache){
  res.status(inCache.status).json(inCache.data);
  return;
}
try{    
  const isBodyExist = Object.keys(req.body || {}).length > 0;
  const requestConfig = {
    method: req.method,
    baseURL: recipientServiceURL,
    url: serviceQuery.join('/'),
  };

  if (isBodyExist) {
    requestConfig.data = req.body;
  }
  const response = await axios(requestConfig);

  if (req.method === 'GET') {
    cache.set(
      cacheKey,
      { status: response.status, data: response.data },
    );
  }

  res.status(response.status).json(response.data);
}catch(error){
  console.log(`Error: ${error}`)
  res.status(error.response.status).send(error.response.data);
}
})

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server listen at port: ${port}`)
})