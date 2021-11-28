const { request: unauthorizedRequest, routes } = require('../lib');
const debug = require('debug')('test:person');

/*
Сценарий 2

GET-запросом получаем все объекты (ожидается пустой массив)
POST-запросом в цикле создаём 3 новых объекта (ожидается ответ, 
  содержащий свежесозданный объект)
GET-запросом получаем все объекты (ожидается массив с 3 объектами)
DELETE-запросом в цикле удаляем все созданные объекты по id (ожидается 
  подтверждение успешного удаления)
GET-запросом получаем все объекты (ожидается пустой массив)
*/

const PERSONS_DATA = [
  {
    name: 'natein',
    age: 100500,
    hobbies: ['programming']
  },
  {
    name: 'Vasya Pupkin',
    age: 100,
    hobbies: ['eating', 'sleeping']
  },
  {
    name: 'John Doe',
    age: 50,
    hobbies: []
  }
];

describe('Second scenario', () => {
  let request = unauthorizedRequest;
  let idArr = [];

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

// POST-запросом в цикле создаём 3 новых объекта (ожидается ответ, 
// содержащий свежесозданный объект)

  test('should create 3 persons successfully', () => {
    PERSONS_DATA.forEach(async (item) => {
      let personId;
      await request
      .post(routes.person.create)
      .set('Accept', 'application/json')
      .send(item)
      .expect(201)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body.personId).to.be.a('string');
        personId = res.body.personId;
        expect(res.body).to.have.property('name');
        expect(res.body).to.have.property('age');
        expect(res.body).to.have.property('hobbies');
        jestExpect(res.body).toMatchObject({            
          name: item.name,
          age: item.age,
          hobbies: item.hobbies
        });
      idArr.push(personId);
      });
    });
  });

// GET-запросом получаем все объекты (ожидается массив с 3 объектами)

  test('should get all persons', async () => {
    const personResponse = await request
      .get(routes.person.getAll)
      .set('Accept', 'application/json')
      .expect(200)
      .expect('Content-Type', /json/);
    debug(personResponse.body);

    expect(personResponse.status).to.equal(200);
    expect(Array.isArray(personResponse.body)).to.be.true();
    expect(personResponse.body.length).to.equal(3);
  });

// DELETE-запросом в цикле удаляем все созданные объекты по id (ожидается 
// подтверждение успешного удаления)

  test('should delete 3 persons successfully', async () => {
    idArr.forEach( async (item) => {
      const deleteResponse = await request.delete(routes.person.delete(item));
      expect(deleteResponse.status).to.equal(204);
    });
  });

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

});
