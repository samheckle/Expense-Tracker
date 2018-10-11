// import libraries
const http = require('http');
const url = require('url');
const query = require('querystring');
const responseHandler = require('./htmlResponses.js');
const jsonHandler = require('./controllers/index.js');


const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/': responseHandler.getIndex,
  '/style.css': responseHandler.getCSS,
  '/bundle.js': responseHandler.getBundle,
  '/addColumn': jsonHandler.handleCategoryPost,
  '/addExpense': jsonHandler.handleExpensePost,
  '/getPage': jsonHandler.handleGet,
  notFound: jsonHandler.notFound,
  index: responseHandler.getIndex,
};

const handlePost = (request, response, parsedUrl) => {
  const body = [];

  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });
  request.on('data', (chunk) => {
    body.push(chunk);
  });

  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();

    const bodyParams = query.parse(bodyString);
    if (parsedUrl.pathname === '/addColumn') {
      jsonHandler.handleCategoryPost(request, response, bodyParams);
    } else if (parsedUrl.pathname === '/addExpense') {
      jsonHandler.handleExpensePost(request, response, bodyParams);
    }
  });
};

const handleGet = (request, response, parsedUrl) => {
  if (urlStruct[parsedUrl.pathname]) {
    urlStruct[parsedUrl.pathname](request, response);
  } else {
    urlStruct.notFound(request, response);
  }
};

const handleHead = (request, response, parsedUrl) => {
  if (urlStruct[parsedUrl.pathname]) {
    urlStruct[parsedUrl.pathname](request, response);
  } else {
    urlStruct.notFound(request, response);
  }
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  } else if (request.method === 'HEAD') {
    handleHead(request, response, parsedUrl);
  } else {
    handleGet(request, response, parsedUrl);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
