const { v4: uuidv4 } = require("uuid");

class Request {
  constructor() {
    this.requests = {}; // Stores all the requests
  }

  createRequest() {
    const requestId = uuidv4(); // Generate a unique request ID
    this.requests[requestId] = { status: "Pending", products: [] }; // Initialize request with status and products
    return requestId;
  }

  updateRequest(requestId, status, products = []) {
    if (this.requests[requestId]) {
      this.requests[requestId].status = status; // Update the request status
      this.requests[requestId].products = products; // Update the products associated with the request
    }
  }

  getRequest(requestId) {
    return this.requests[requestId]; // Get request details by request ID
  }
}

module.exports = new Request(); // Export a singleton instance of the Request class
