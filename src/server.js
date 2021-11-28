const http = require('http');
const { PORT } = require('./common/config');
const personRoutes = require('./resources/persons/person.router');
const { NotFoundError } = require('./common/custom-errors');

const mapper = {
  GET: personRoutes.getPerson,
  POST: personRoutes.insertPerson,
  PUT: personRoutes.updatePerson,
  DELETE: personRoutes.deletePerson
}
const port = PORT || 4000;
 
const server = http.createServer((req, res) => {
  const method = req.method;
  const url = req.url;

  try {
    if (url.includes('/person')) {
      if(method === 'GET' && url === '/person' ) personRoutes.getAllPersons(req, res);
      else mapper[method](req, res);
    } else throw new NotFoundError(url);
  } catch(err) {
    res.statusCode = (err.code) ? err.code : 500;
    const message = (err.code) ? err.message : 'Internal Server Error';
    res.end(message);
  }

});

server.listen(port, () => {
  console.log(`Server running at port ${port}`)
});
