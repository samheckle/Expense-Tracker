const example1 = (req, res) => {
  res.render('example1');
};

const columns = {};

const respondJSON = (request, response, status, object) => {
  response.format({
    'application/json': function () {
      response.status(status).json(object);
    },
    'default': function () {
      // log the request and respond with 406
      response.status(406).send('Not Acceptable');
    }
  });
};

const respondJSONMeta = (request, response, status) => {
  response.status(status).send();
};

const getUsers = (request, response) => {
  const responseJSON = {
    users,
  };

  if (request.method === 'GET') {
    respondJSON(request, response, 200, responseJSON);
  } else {
    respondJSONMeta(request, response, 200);
  }
};

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

const handleCategoryPost = (req, res) => {

  if (req.path === "/addColumn") {
    const responseJSON = {
      message: 'Category name required',
    };

    if (req.body.name === '') {
      responseJSON.id = 'missingParams';
      return respondJSON(req, res, 400, responseJSON);
    }

    let responseCode = 201;
    if (columns[req.body.name]) {
      responseCode = 204;
    } else {
      columns[req.body.name] = {};
    }

    columns[req.body.name].name = req.body.name;

    if (responseCode === 201) {
      responseJSON.message = 'created successfully';
      return respondJSON(req, res, responseCode, responseJSON);
    }

    return respondJSONMeta(req, res, responseCode);
  }
}


module.exports = {
  getUsers,
  notFound,
  example1,
  handleCategoryPost
};