const { request: unauthorizedRequest, routes } = require('../lib');
const debug = require('debug')('test:person');

/*
Сценарий 2

POST-запросом в цикле создаём 3 новых объекта (ожидается ответ, 
  содержащий свежесозданный объект)

DELETE-запросом в цикле удаляем все созданные объекты по id (ожидается 
  подтверждение успешного удаления)
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

// DELETE-запросом в цикле удаляем все созданные объекты по id (ожидается 
// подтверждение успешного удаления)

  test('should delete 3 persons successfully', async () => {
    idArr.forEach( async (item) => {
      const deleteResponse = await request.delete(routes.person.delete(item));
      expect(deleteResponse.status).to.equal(204);
    });
  });

});
