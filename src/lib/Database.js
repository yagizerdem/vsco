import User from "@/models/User";

const { default: mongoose } = require("mongoose");

class Database {
  constructor() {
    this.open = this.withErrorHandling(this.open);
    this.close = this.withErrorHandling(this.close);
    this.insertUser = this.withErrorHandling(this.insertUser);
    this.findAll = this.withErrorHandling(this.findAll);
    this.findOne = this.withErrorHandling(this.findOne);
  }

  withErrorHandling(fn) {
    return async (...args) => {
      try {
        return await fn.apply(this, args);
      } catch (error) {
        return this.handleError(error, fn.name);
      }
    };
  }

  open = async () => {
    await mongoose.connect(process.env.DBCONNECTIONSTRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connection successful");
    return { ok: true };
  };

  close = async () => {
    await mongoose.disconnect();
    console.log("Database connection closed");
    return { ok: true };
  };
  insertUser = async (user) => {
    const newUser = new User(user);
    await newUser.save();
    return { ok: true };
  };
  findAll = async (model, query = {}) => {
    const documents = model.find(query);
    return documents;
  };
  findOne = async (model, query = {}) => {
    const documents = model.findOne(query);
    return documents;
  };
  handleError = (error, functionName) => {
    console.error(`Error in function ${functionName}:`, error);
    return { ok: false };
  };
}

export default Database;
