import request from "supertest"
import app from "../server"
import { IBallot } from "../models/ballot"
import * as testDB from "../config/test-db"

beforeAll(async () => {
  await testDB.connect()
})

afterEach(async () => {
  await testDB.clearDatabase()
})

afterAll(async () => {
  await testDB.closeDatabase()
})

describe("/ballot", () => {
  it("should create a new ballot on POST", async (done) => {
    const body: IBallot = {
      title: "Who should be the next President of the U.S?",
      options: ["Joe Biden", "Orange Clown"],
    }
    const res = await request(app).post("/ballot").send(body)

    expect(res.body).toHaveProperty("ballot")
    expect(res.body.message).toBe("new ballot created")
    expect(res.header["content-type"]).toBe("application/json; charset=utf-8")
    expect(res.status).toBe(201)
    done()
  })
  it("should return a bad request on POST if body is missing the right keys", async (done) => {
    const body = {
      title: "Who should be the next President of the U.S?",
      wrongKey: ["Joe Biden", "Orange Clown"],
    }
    const res = await request(app).post("/ballot").send(body)

    expect(res.body.message).toBe("bad request: invalid ballot")
    expect(res.header["content-type"]).toBe("application/json; charset=utf-8")
    expect(res.status).toBe(400)
    done()
  })
})
