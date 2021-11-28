const { request: unauthorizedRequest, routes } = require('../lib');
const debug = require('debug')('test:person');

/*
Сценарий 1

GET-запросом получаем все объекты (ожидается пустой массив)
POST-запросом создается новый объект (ожидается ответ, содержащий свежесозданный объект)
GET-запросом пытаемся получить созданный объект по его id (ожидается созданный объект)
PUT-запросом пытаемся обновить созданный объект (ожидается ответ, содержащий 
  обновленный объект с тем же id)
DELETE-запросом удаляем созданный объект по id (ожидается подтверждение 
  успешного удаления)
GET-запросом пытаемся получить удаленный объект по id (ожидается ответ, 
  что такого объекта нет)
*/

const PERSON_DATA = {
  name: 'Vasya Pupkin',
  age: 100,
  hobbies: ["eating", "sleeping"]
};

describe('First scenario', () => {
  let request = unauthorizedRequest;
  let personId;

// GET-запросом получаем все объекты (ожидается пустой массив)

  test('should get all persons', async () => {
    const personResponse = await request
      .get(routes.person.getAll)
      .set('Accept', 'application/json')
      .expect(200)
      .expect('Content-Type', /json/);
    debug(personResponse.body);

    expect(personResponse.status).to.equal(200);
    expect(Array.isArray(personResponse.body)).to.be.true();
    expect(personResponse.body.length).to.equal(0);
  });

// POST-запросом создается новый объект (ожидается ответ, содержащий 
// свежесозданный объект)

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

// GET-запросом пытаемся получить созданный объект по его id (ожидается 
// созданный объект)

  test('should get a person by id', async () => {
    const personResponse = await request
      .get(routes.person.getById(personId))
      .set('Accept', 'application/json')
      .expect(200)
      .expect('Content-Type', /json/);

    expect(personResponse.body).to.be.instanceOf(Object);
    expect(personResponse.body.personId).to.equal(personId);
  });

// PUT-запросом пытаемся обновить созданный объект (ожидается ответ, содержащий 
// обновленный объект с тем же id)

  test('should update person successfully', async () => {
    const updatedPerson = {
    ...PERSON_DATA,
    name: 'New name for Person',
    personId: personId
  };

  await request
    .put(routes.person.update(personId))
    .set('Accept', 'application/json')
    .send(updatedPerson)
    .expect(200)
    .expect('Content-Type', /json/);

  const { ...expectedPerson } = updatedPerson;

  await request
    .get(routes.person.getById(personId))
    .set('Accept', 'application/json')
    .expect(200)
    .expect('Content-Type', /json/)
    .then(res => jestExpect(res.body).toMatchObject(expectedPerson));
  });

// DELETE-запросом удаляем созданный объект по id (ожидается подтверждение 
// успешного удаления)

  test('should delete person successfully', async () => {
    const deleteResponse = await request.delete(routes.person.delete(personId));
    expect(deleteResponse.status).to.equal(204);
  });

// GET-запросом пытаемся получить удаленный объект по id (ожидается ответ,
// что такого объекта нет)

  test('should get 404 error', async () => {
    const personResponse = await request
      .get(routes.person.getById(personId))
      .set('Accept', 'application/json')
      .expect(404);
    expect(personResponse.body).to.be.instanceOf(Object);
  });  

});
