const { v4: uuidv4 } = require('uuid');

class Person {
  constructor({
    personId = uuidv4(),
    name = 'Don Joe',
    age = 0,
    hobbies = []
  } = {}) {
    this.personId = personId;
    this.name = name;
    this.age = age;
    this.hobbies = hobbies;
  }
}

module.exports = Person;
