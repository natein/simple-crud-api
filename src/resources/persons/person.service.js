const repository = require('./person.repository');

const getAll = () => repository.getAllPersons();
const get = personId => repository.getPersonById(personId);
const insert = person => repository.insertNewPerson(person);
const update = (personId, person) => repository.updatePersonById(personId, person);
const remove = personId => repository.removePersonById(personId);

module.exports = {
  getAll,
  get,
  insert,
  update,
  remove
};
