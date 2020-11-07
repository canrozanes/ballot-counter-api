import request from "supertest"
import app from "./server"

describe("GET /user", () => {
  it("responds with json", (done) => {
    request(app)
      .get("/")
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect("API Running")
      .expect(200, done)
  })
})
