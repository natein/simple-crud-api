const { DatabaseIntegrityError, IdAlreadyExistError } = require('./custom-errors');
const Person = require('../resources/persons/person.model');

let db = [];

(() => {
  db.push(new Person({name: "John Doe", age: 36, 
    hobbies: ['swimming', 'walking']}));
  db.push(new Person({name: "Natein", age: 100500, 
    hobbies: ['swimming', 'walking', 'programming']}));
})();

const getAll = () => db;

const getItem = (personId) => {
  const items = db.filter(item => item.personId === personId);
  if (items.length > 1) throw new DatabaseIntegrityError();
  return (items.length) ? items[0] : null;
}

const insertItem = (item) => {
  const existingItem = getItem(item.personId);
  if (!existingItem) db.push(item);
  else throw new IdAlreadyExistError(item.personId);
  return getItem(item.personId);
}

const updateItem = (personId, item) => {
  const existingItem = getItem(personId);
  if (existingItem) {
    const idx = db.indexOf(existingItem);
    db[idx] = {personId, ...item };
  }
  return getItem(personId);
};

const deleteItem = (personId) => {
  const existingItem = getItem(personId);
  if (existingItem) {
    const idx = db.indexOf(existingItem);
    db = db.slice(0, idx).concat(db.slice(idx+1));
    return true;
  } else return false;
};

module.exports = {
  getAll,
  getItem,
  insertItem,
  updateItem,
  deleteItem
};
