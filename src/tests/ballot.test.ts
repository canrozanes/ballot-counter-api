import request from "supertest"
import app from "../server"
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

const castVote = async (choice: string, ballotID: string) => {
  await request(app).post(`/ballot/${ballotID}/cast-vote`).send({ choice })
}

describe("/ballot", () => {
  it("should create a new ballot on POST", async (done) => {
    const body = {
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
  it("should return the winner if a request is made to /set-voting-complete and there is at least one vote", async (done) => {
    const body = {
      title: "Who should be the next President of the U.S?",
      options: ["Joe Biden", "Orange Clown"],
    }
    const createBallotRes = await request(app).post("/ballot").send(body)
    const ballotID = createBallotRes.body.ballot._id

    await castVote("Joe Biden", ballotID)
    await castVote("Joe Biden", ballotID)
    await castVote("Orange Clown", ballotID)

    const res = await request(app)
      .patch(`/ballot/${ballotID}/set-voting-complete`)
      .send()

    expect(res.body.message).toBe("voting is complete")
    expect(res.body.winner).toBe("Joe Biden")
    expect(res.header["content-type"]).toBe("application/json; charset=utf-8")
    expect(res.status).toBe(200)
    done()
  })
})
