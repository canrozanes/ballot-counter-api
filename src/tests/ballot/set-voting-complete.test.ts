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

const castVote = async (choice: string, ballotID: string) => {
  await request(app).post(`/ballot/${ballotID}/cast-vote`).send({ choice })
}

describe("/ballot/:id/set-voting-complete", () => {
  it("should return a 404 on PATCH if ballot with id cannot be found", async (done) => {
    const id = "56e6dd2eb4494ed008d595bd"
    const adminToken = "1234"
    const res = await request(app).patch(
      `/ballot/${id}/set-voting-complete?adminToken=${adminToken}`
    )

    expect(res.body.message).toBe("no such ballot exists")
    expect(res.header["content-type"]).toBe("application/json; charset=utf-8")
    expect(res.status).toBe(404)
    done()
  })
  it("should return a 403 on PATCH if ballot is already complete", async (done) => {
    const body = {
      title: "Who should be the next President of the U.S?",
      options: ["Joe Biden", "Orange Clown"],
    }
    const createBallotRes = await request(app).post("/ballot").send(body)

    const { _id: ballotID, adminToken } = createBallotRes.body.ballot
    await request(app).patch(
      `/ballot/${ballotID}/set-voting-complete?adminToken=${adminToken}`
    )

    const res = await request(app).patch(
      `/ballot/${ballotID}/set-voting-complete?adminToken=${adminToken}`
    )

    expect(res.body.message).toBe("ballot is already complete")
    expect(res.header["content-type"]).toBe("application/json; charset=utf-8")
    expect(res.status).toBe(403)
    done()
  })
  it("should return the winner if a POST request is made and there is at least one vote", async (done) => {
    const body = {
      title: "Who should be the next President of the U.S?",
      options: ["Joe Biden", "Orange Clown"],
    }
    const createBallotRes = await request(app).post("/ballot").send(body)
    const { _id: ballotID, adminToken } = createBallotRes.body.ballot

    await castVote("Joe Biden", ballotID)
    await castVote("Joe Biden", ballotID)
    await castVote("Orange Clown", ballotID)

    const res = await request(app)
      .patch(`/ballot/${ballotID}/set-voting-complete?adminToken=${adminToken}`)
      .send()

    expect(res.body.message).toBe("voting is complete")
    expect(res.body.winner).toBe("Joe Biden")
    expect(res.header["content-type"]).toBe("application/json; charset=utf-8")
    expect(res.status).toBe(200)
    done()
  })
  it("should return a bad request if adminToken is wrong", async (done) => {
    const createBallotRes = await request(app)
      .post("/ballot")
      .send({ title: "title", options: ["a", "b", "c"] })

    const { _id: ballotID } = createBallotRes.body.ballot
    const wrongadminToken = "123123-123123"

    const res = await request(app).patch(
      `/ballot/${ballotID}/set-voting-complete?adminToken=${wrongadminToken}`
    )

    expect(res.body.message).toBe("no such ballot exists")
    expect(res.header["content-type"]).toBe("application/json; charset=utf-8")
    expect(res.status).toBe(404)
    done()
  })
  it("should cancel voting if a request is made on a ballot with no votes", async (done) => {
    const body = {
      title: "Who should be the next President of the U.S?",
      options: ["Joe Biden", "Orange Clown"],
    }
    const createBallotRes = await request(app).post("/ballot").send(body)

    const { _id: ballotID, adminToken } = createBallotRes.body.ballot
    const res = await request(app).patch(
      `/ballot/${ballotID}/set-voting-complete?adminToken=${adminToken}`
    )

    expect(res.body.message).toBe(
      "no vote was cast on this ballot, vote is now cancelled"
    )
    expect(res.header["content-type"]).toBe("application/json; charset=utf-8")
    expect(res.status).toBe(403)
    done()
  })
  it("should return server error if Ballot.findByID fails", async (done) => {
    jest
      .spyOn(Ballot, "findById")
      .mockImplementationOnce((): any =>
        Promise.reject(new Error("failed to save"))
      )

    const id = "56e6dd2eb4494ed008d595bd"
    const res = await request(app).patch(`/ballot/${id}/set-voting-complete`)

    expect(res.body.message).toBe("something went wrong")
    expect(res.header["content-type"]).toBe("application/json; charset=utf-8")
    expect(res.status).toBe(500)
    done()
  })
})
