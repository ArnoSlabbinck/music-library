const request = require("supertest");
const app = require("../app");

function execute(method, url, builder = (req) => req, code = 200) {
  return new Promise((resolve) => {
    const intermediate = request(app)[method](url).expect(code);
    builder(intermediate);
    intermediate.then((body) => {
      resolve(body.text ? JSON.parse(body.text ?? "{}") : "no-content");
    });
  });
}

function successfullGet(url) {
  return execute("get", url);
}

function notFoundGet(url) {
  return execute("get", url, (req) => req, 404);
}

function successfullPost(url, data) {
  return execute("post", url, (req) => req.send(data), 201);
}

function notFoundPost(url, data) {
  return execute("post", url, (req) => req.send(data), 404);
}

function badRequestPost(url, data) {
  return execute("post", url, (req) => req.send(data), 400);
}

function successfullPut(url, data) {
  return execute("put", url, (req) => req.send(data), 200);
}

function notFoundPut(url, data) {
  return execute("put", url, (req) => req.send(data), 404);
}

function notFoundDelete(url) {
  return execute("delete", url, (req) => req, 404);
}

function successfulDelete(url) {
  return execute("delete", url, (req) => req, 204);
}

function badRequestDelete(url) {
  return execute("delete", url, (req) => req, 400);
}

module.exports = {
  badRequestDelete,
  successfulDelete,
  notFoundDelete,
  notFoundPut,
  successfullPut,
  badRequestPost,
  successfullPost,
  notFoundGet,
  successfullGet,
  notFoundPost,
};
