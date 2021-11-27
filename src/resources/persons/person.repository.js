const database = require('../../common/db');
  const { NotFoundPersonError } = require('../../common/custom-errors');  
const Person = require('./person.model');

const getAllPersons = async () => database.getAll();

const getPersonById = async personId => {
  const user = await database.getItem(personId);
  if (!user) throw new NotFoundPersonError(personId);
  return user;
};

const insertNewPerson = async person => database.insertItem(new Person(person));

const updatePersonById = async (personId, person) => {
  const item = await database.updateItem(personId, person);
  if (!item) throw new NotFoundPersonError(personId);
  return item;
};

const removePersonById = async personId => {
  const result = await database.deleteItem(personId);
  if (!result) throw new NotFoundPersonError(personId);
};

module.exports = {
  getAllPersons,
  getPersonById,
  removePersonById,
  insertNewPerson,
  updatePersonById
};
