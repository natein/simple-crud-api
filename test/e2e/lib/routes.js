module.exports = {
  person: {
    getAll: '/person',
    getById: id => `/person/${id}`,
    create: '/person',
    update: id => `/person/${id}`,
    delete: id => `/person/${id}`
  }
};
