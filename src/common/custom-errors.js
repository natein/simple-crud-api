class CrudError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.isCustom = true;
  }  
}

class DatabaseIntegrityError extends CrudError {
  constructor() {
    super(`Database is corrupted`);
    this.code = 500;    
  }  
}

class InvalidIdError extends CrudError {
  constructor(uuid) {
    super(`personId=${uuid} is invalid (not uuid)`);
    this.code = 400;    
  }
}

class NotContainRequiredFieldsError extends CrudError {
  constructor(uuid) {
    super(`Request body does not contain required fields`);
    this.code = 400;    
  }
}

class IdAlreadyExistError extends CrudError {
  constructor(uuid) {
    super(`personId=${uuid} already exists`);
    this.code = 500;
  }
}

class NotFoundPersonError extends CrudError {
  constructor(uuid) {
    super(`Person with personId=${uuid} does not exist`);
    this.code = 404;
  }
}

class NotFoundError extends CrudError {
  constructor(route) {
    super(`Route ${route} not found`);
    this.code = 404;
  }
}

module.exports = {
  DatabaseIntegrityError,
  InvalidIdError,
  IdAlreadyExistError,
  NotFoundPersonError,
  NotFoundError,
  NotContainRequiredFieldsError
};
