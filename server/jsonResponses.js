// objects that hold values of columns
const columns = {};
const cards = [];

// get response with object
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, {
    'Content-Type': 'application/json',
  });
  response.write(JSON.stringify(object));
  response.end();
};

// head response with no object
const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, {
    'Content-Type': 'application/json',
  });
  response.end();
};

// get response with 404
const notFound = (request, response) => {
  const responseObj = {
    id: 'notFound',
    message: 'The page you are looking for is not found',
  };

  if (request.method === 'GET') {
    return respondJSON(request, response, 404, responseObj);
  }

  return respondJSONMeta(request, response, 404);
};

// handles the creation of a new category
// does check for repeating values
const handleCategoryPost = (req, res, body) => {
  const responseJSON = {
    message: 'Category name required',
  };

  if (body.name === '') {
    responseJSON.id = 'missingParams';
    return respondJSON(req, res, 400, responseJSON);
  }

  let responseCode = 201;
  if (columns[body.name]) {
    responseCode = 204;
  } else {
    columns[body.name] = {};
  }

  columns[body.name].name = body.name;

  if (responseCode === 201) {
    responseJSON.message = 'created successfully';
    return respondJSON(req, res, responseCode, responseJSON);
  }

  return respondJSONMeta(req, res, responseCode);
};

// handles creation of new expense
// does not return 204 because repeating values are allowed
const handleExpensePost = (req, res, body) => {
  const responseJSON = {
    message: 'Missing ',
  };

  if (body.item === '' || body.amount === '' || body.date === '') {
    responseJSON.id = 'missingParams';
    if (body.item === '') {
      responseJSON.message += 'item name ';
    }
    if (body.amount === '') {
      responseJSON.message += 'amount ';
    }
    if (body.date === '') {
      responseJSON.message += 'date';
    }
    return respondJSON(req, res, 400, responseJSON);
  }

  const responseCode = 201;

  const obj = {
    item: body.item,
    amount: body.amount,
    date: body.date,
    notes: body.notes,
  };
  cards.push(obj);

  if (responseCode === 201) {
    responseJSON.message = 'created successfully';
    return respondJSON(req, res, responseCode, responseJSON);
  }

  return respondJSONMeta(req, res, responseCode);
};

// gets the page when it loads
const handleGet = (req, res, parsedUrl) => {
  const responseJSON = {
    columns,
    cards,
  };
  if (req.method === 'GET') {
    let str;
    if (parsedUrl !== undefined) {
      str = parsedUrl.replace('false', 'true');
    }
    req.url(req.url.replace('refresh=false', str));
    respondJSON(req, res, 200, responseJSON);
  } else {
    respondJSONMeta(req, res, 200);
  }
};


module.exports = {
  notFound,
  handleCategoryPost,
  handleExpensePost,
  handleGet,
};
