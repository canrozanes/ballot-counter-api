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

describe("/ballot/:id/cast-vote", () => {
  it("should return a bad request on POST if ballot with id cannot be found", async (done) => {
    const id = "56e6dd2eb4494ed008d595bd"
    const res = await request(app).post(`/ballot/${id}/cast-vote`)

    expect(res.body.message).toBe("bad request: invalid vote")
    expect(res.header["content-type"]).toBe("application/json; charset=utf-8")
    expect(res.status).toBe(400)
    done()
  })
  it("should return server error if Ballot.findByID fails", async (done) => {
    jest
      .spyOn(Ballot, "findById")
      .mockImplementationOnce((): any =>
        Promise.reject(new Error("failed to save"))
      )

    const id = "56e6dd2eb4494ed008d595bd"
    const res = await request(app).post(`/ballot/${id}/cast-vote`)

    expect(res.body.message).toBe("something went wrong")
    expect(res.header["content-type"]).toBe("application/json; charset=utf-8")
    expect(res.status).toBe(500)
    done()
  })
})
