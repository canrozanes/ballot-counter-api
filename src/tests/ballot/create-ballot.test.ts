import request from "supertest"
import app from "../../server"
import Ballot from "../../models/ballot"
import * as testDB from "../../config/test-db"

beforeAll(async () => {
  await testDB.connect()
})

afterEach(async () => {
  await testDB.clearDatabase()
  jest.restoreAllMocks()
})

afterAll(async () => {
  await testDB.closeDatabase()
})

const createBallot = async (title: string, options: string[]) => {
  const res = await request(app).post("/ballot").send({ title, options })
  return res
}

describe("/ballot", () => {
  // POST
  it("should create a new ballot on POST", async (done) => {
    const body = {
      title: "Who should be the next President of the U.S?",
      options: ["Joe Biden", "Orange Clown"],
    }
    const res = await createBallot(body.title, body.options)

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
  it("should throw an error on POST if Ballot.save() method fails", async (done) => {
    jest
      .spyOn(Ballot.prototype, "save")
      .mockImplementationOnce(() => Promise.reject(new Error("failed to save")))

    const body = {
      title: "Who should be the next President of the U.S?",
      options: ["Joe Biden", "Orange Clown"],
    }
    const res = await createBallot(body.title, body.options)

    expect(res.body.message).toBe("something went wrong")
    expect(res.header["content-type"]).toBe("application/json; charset=utf-8")
    expect(res.status).toBe(500)
    done()
  })
})
