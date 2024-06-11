class ApiFeatures {
  constructor({ query }) {
    this.query = query;
  }
  skip(count) {
    this.query = this.query.skip(count);
    return this;
  }
  limit(count) {
    this.query = this.query.limit(count);
    return this;
  }
  getQuery() {
    return this.query;
  }
}
export default ApiFeatures;
