const Person = require('./person.model');
const personService = require('./person.service');
const uuid = require('uuid');
const { InvalidIdError, NotContainRequiredFieldsError, JsonParseError } 
  = require('../../common/custom-errors');

// GET /pesron - get all persons

const getAllPersons = async (req, res) => {
  try {
    const persons = await personService.getAll();
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 200;
    res.end(JSON.stringify(persons));
  } catch(err) {
    res.statusCode = (err.code) ? err.code : 500;
    const message = (err.code) ? err.message : 'Internal Server Error';
    res.end(message);
  }
};

// GET /pesron/:personId - get the person by id 

const getPerson = async (req, res) => {
  try {
    const url = req.url;
    const personId = url.substring('./person'.length);
    if(uuid.validate(personId)) {
      const person = await personService.get(personId);
      res.setHeader("Content-Type", "application/json");
      res.statusCode = 200;
      res.end(JSON.stringify(person));
    } else throw new InvalidIdError(personId);
  } catch(err) {
    res.statusCode = (err.code) ? err.code : 500;
    const message = (err.code) ? err.message : 'Internal Server Error';
    res.end(message);
  }
};
  
// POST /person - create person  
  
const insertPerson = async (req, res) => {
  let data = [];
  req.on('data', (chunk) => {
    data.push(chunk);
  }).on('end', async () => {
    const body = Buffer.concat(data).toString();
    try {
      let newPersonData;
      try {
        newPersonData = JSON.parse(body);
      } catch (err) {
        throw new JsonParseError(err.message);
      } 
      if(newPersonData.age === undefined || newPersonData.name === undefined 
        || newPersonData.hobbies === undefined) throw new NotContainRequiredFieldsError();
      const insertedPerson = await personService.insert(newPersonData);
      res.setHeader("Content-Type", "application/json");
      res.statusCode = 201;
      res.end(JSON.stringify(insertedPerson));
    } catch(err) {
      res.statusCode = (err.code) ? err.code : 500;
      const message = (err.code) ? err.message : 'Internal Server Error';
      res.end(message);
    }
  });
};

// PUT /person/:personId - update person by id

const updatePerson = async (req, res) => {
  let data = [];
  req.on('data', (chunk) => {
    data.push(chunk);
  }).on('end', async () => {
    const url = req.url;    
    const personId = url.substring('./person'.length);
    const body = Buffer.concat(data).toString();  
    try {
      let newPersonData;
      try {
        newPersonData = JSON.parse(body);
      } catch(err) {
        throw new JsonParseError(err.message);
      }

      if(newPersonData.age === undefined || newPersonData.name === undefined 
        || newPersonData.hobbies === undefined) throw new NotContainRequiredFieldsError();
      if(uuid.validate(personId)) {
        const updatedPerson = await personService.update(personId, newPersonData);
        res.setHeader("Content-Type", "application/json");
        res.statusCode = 200;
        res.end(JSON.stringify(updatedPerson));      
      } else throw new InvalidIdError(personId);
    } catch(err) {
      res.statusCode = (err.code) ? err.code : 500;
      const message = (err.code) ? err.message : 'Internal Server Error';
      res.end(message);
    }
  });
};
  
// DELETE /petdon/:personId - delete person by id
  
const deletePerson = async (req, res) => {
  try {
    const url = req.url;
    const personId = url.substring('./person'.length);
    if(uuid.validate(personId)) {
      await personService.remove(personId);
      res.setHeader("Content-Type", "application/json");
      res.statusCode = 204;
      res.end();
    } else throw new InvalidIdError(personId);
  } catch(err) {
    res.statusCode = (err.code) ? err.code : 500;
    const message = (err.code) ? err.message : 'Internal Server Error';
    res.end(message);
  }
};

module.exports = {
  getAllPersons, 
  getPerson, 
  insertPerson, 
  updatePerson, 
  deletePerson
};
