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

describe("/ballot/:id/update-ballot", () => {
  it("should return a bad request on POST if ballot with id cannot be found", async (done) => {
    const createBallotRes = await request(app)
      .post("/ballot")
      .send({ title: "title", options: ["a", "b", "c"] })

    const { _id: ballotID, adminToken } = createBallotRes.body.ballot
    const badBody = {
      foo: "bar",
    }
    const res = await request(app)
      .patch(`/ballot/${ballotID}/update-ballot?adminToken=${adminToken}`)
      .send(badBody)

    expect(res.body.message).toBe("bad request: this operation is not valid")
    expect(res.header["content-type"]).toBe("application/json; charset=utf-8")
    expect(res.status).toBe(400)
    done()
  })
  it("should return a bad request on POST if ballot doesn't exist", async (done) => {
    const id = "56e6dd2eb4494ed008d595bd"
    const body = {
      title: "some string",
      options: ["a", "b", "c"],
    }
    const res = await request(app)
      .patch(`/ballot/${id}/update-ballot`)
      .send(body)

    expect(res.body.message).toBe("no such ballot exists")
    expect(res.header["content-type"]).toBe("application/json; charset=utf-8")
    expect(res.status).toBe(404)
    done()
  })
  it("should return a bad request on POST if adminToken is wrong", async (done) => {
    const createBallotRes = await request(app)
      .post("/ballot")
      .send({ title: "title", options: ["a", "b", "c"] })

    const { _id: ballotID } = createBallotRes.body.ballot
    const wrongadminToken = "123123-123123"

    const body = {
      title: "some string",
      options: ["a", "b", "c"],
    }
    const res = await request(app)
      .patch(`/ballot/${ballotID}/update-ballot?adminToken=${wrongadminToken}`)
      .send(body)

    expect(res.body.message).toBe("no such ballot exists")
    expect(res.header["content-type"]).toBe("application/json; charset=utf-8")
    expect(res.status).toBe(404)
    done()
  })
  it("should properly update the ballot if all goes well", async (done) => {
    const createBallotRes = await request(app)
      .post("/ballot")
      .send({ title: "title", options: ["a", "b", "c"] })

    const { _id: ballotID, adminToken } = createBallotRes.body.ballot

    const body = {
      title: "updated string",
    }
    const res = await request(app)
      .patch(`/ballot/${ballotID}/update-ballot?adminToken=${adminToken}`)
      .send(body)

    expect(res.body.message).toBe("update successful")
    expect(res.body.title).toBe("updated string")
    expect(res.header["content-type"]).toBe("application/json; charset=utf-8")
    expect(res.status).toBe(200)
    done()
  })
  it("should return server error if mongo service fails", async (done) => {
    jest
      .spyOn(Ballot, "findByIdAndUpdate")
      .mockImplementationOnce((): any =>
        Promise.reject(new Error("failed to find"))
      )

    const createBallotRes = await request(app)
      .post("/ballot")
      .send({ title: "title", options: ["a", "b", "c"] })

    const { _id: ballotID, adminToken } = createBallotRes.body.ballot

    const body = {
      title: "updated string",
    }
    const res = await request(app)
      .patch(`/ballot/${ballotID}/update-ballot?adminToken=${adminToken}`)
      .send(body)

    expect(res.body.message).toBe("something went wrong")
    expect(res.header["content-type"]).toBe("application/json; charset=utf-8")
    expect(res.status).toBe(500)
    done()
  })
})
