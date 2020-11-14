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

const createBallot = async (title: string, options: string[]) => {
  const res = await request(app).post("/ballot").send({ title, options })
  return res
}

describe("/ballot/:id", () => {
  it("should return the existing ballot on GET", async (done) => {
    const body = {
      title: "Who should be the next President of the U.S?",
      options: ["Joe Biden", "Orange Clown"],
    }
    const createBallotRes = await createBallot(body.title, body.options)
    const ballotID = createBallotRes.body.ballot._id

    const res = await request(app).get(`/ballot/${ballotID}`)

    expect(res.body).toHaveProperty("ballot")
    expect(res.body.message).toBe("success")
    expect(res.header["content-type"]).toBe("application/json; charset=utf-8")
    expect(res.status).toBe(200)
    done()
  })
  it("should return a 404 on GET if id does not correspond to a ballot", async (done) => {
    const id = "56e6dd2eb4494ed008d595bd"

    const res = await request(app).get(`/ballot/${id}`)

    expect(res.body.message).toBe("ballot not found")
    expect(res.header["content-type"]).toBe("application/json; charset=utf-8")
    expect(res.status).toBe(404)
    done()
  })
  it("should throw an error on GET if Ballot.findById() method fails", async (done) => {
    const id = "56e6dd2eb4494ed008d595bd"
    jest
      .spyOn(Ballot, "findById")
      .mockImplementationOnce((): any =>
        Promise.reject(new Error("failed to save"))
      )
    const res = await request(app).get(`/ballot/${id}`)

    expect(res.body.message).toBe("something went wrong")
    expect(res.header["content-type"]).toBe("application/json; charset=utf-8")
    expect(res.status).toBe(500)
    done()
  })
})
