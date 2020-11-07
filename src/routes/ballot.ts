import { Router, Request, Response } from "express"

const ballot = Router()

ballot.get("/", (request: Request, response: Response) => {
  return response.json("OK")
})

export default ballot
