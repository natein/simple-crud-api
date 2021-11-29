const debug = require('debug')('test:person');
const { v4: uuidv4 } = require('uuid');
const { request: unauthorizedRequest, routes } = require('../lib');


/*
Сценарий 3

POST-запросом создается новый объект (ожидается созданный объект)
C помощью uuid генерируем случайный id
GET-запросом пытаемся получить созданный объект по случайному id (ожидается статус 404)
PUT-запросом пытаемся обновить созданный объект по случайному id (ожидается статус 404)
DELETE-запросом пытаемся удалить созданный объект по случайному id (ожидается статус 404)
DELETE-запросом удаляем созданный объект по его действительному id
*/

const PERSON_DATA = {
  name: 'natein',
  age: 100500,
  hobbies: ['programming']
};

const NEW_PERSON_DATA = {
  name: 'Vasya Pupkin',
  age: 100,
  hobbies: ['eating', 'sleeping']
};

describe('Third scenario', () => {
  let request = unauthorizedRequest;
  let personId;

// C помощью uuid генерируем случайный id

  let randomId = uuidv4();

// POST-запросом создается новый объект (ожидается созданный объект)

  test('should create person successfully', async () => {
    await request
      .post(routes.person.create)
      .set('Accept', 'application/json')
      .send(PERSON_DATA)
      .expect(201)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body.personId).to.be.a('string');
        personId = res.body.personId;
        expect(res.body).to.have.property('name');
        expect(res.body).to.have.property('age');
        expect(res.body).to.have.property('hobbies');
        jestExpect(res.body).toMatchObject({            
          name: PERSON_DATA.name,
          age: PERSON_DATA.age,
          hobbies: PERSON_DATA.hobbies
        });
      });
  });

// GET-запросом пытаемся получить созданный объект по случайному id (ожидается статус 404)

test('get not existing person, should get 404 error', async () => {
  const personResponse = await request
    .get(routes.person.getById(randomId))
    .set('Accept', 'application/json')
    .expect(404);

  expect(personResponse.body).to.be.instanceOf(Object);
});

// PUT-запросом пытаемся обновить созданный объект по случайному id (ожидается статус 404)

test('update not existing person, should get 404 error ', async () => {

  const updatedPerson = {
    ...NEW_PERSON_DATA,
    personId: randomId
  };

  await request
    .put(routes.person.update(randomId))
    .set('Accept', 'application/json')
    .send(updatedPerson)
    .expect(404);    
});

// DELETE-запросом пытаемся удалить созданный объект по случайному id (ожидается статус 404)

  test('delete not existing person, should get 404 error', async () => {
    const deleteResponse = await request.delete(routes.person.delete(randomId));
    expect(deleteResponse.status).to.equal(404);
  });

// DELETE-запросом удаляем созданный объект по его действительному id

  test('delete not existing person, should get 404 error', async () => {
    const deleteResponse = await request.delete(routes.person.delete(personId));
    expect(deleteResponse.status).to.equal(204);
  });

});