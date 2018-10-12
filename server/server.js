// import libraries
const http = require('http');
const url = require('url');
const query = require('querystring');
const responseHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// url struct to manage all of the urls that are needed
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

// handles all posts requests so that the data is passed correctly
const handlePost = (request, response, parsedUrl) => {
  const body = [];

  request.on('error', (err) => {
    console.dir(err);
    response.statusCode(400);
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

// handles all get requests to route them to the correct url
const handleGet = (request, response, parsedUrl) => {
  if (urlStruct[parsedUrl.pathname]) {
    urlStruct[parsedUrl.pathname](request, response, parsedUrl.query);
  } else {
    urlStruct.notFound(request, response);
  }
};

// handles all head requests to route them to correct url and no repsonse
const handleHead = (request, response, parsedUrl) => {
  if (urlStruct[parsedUrl.pathname]) {
    urlStruct[parsedUrl.pathname](request, response);
  } else {
    urlStruct.notFound(request, response);
  }
};

// routes the HTTP methods to the correct handlers in this file
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

// create server
http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
