import { Request, Response } from "express"
import { v4 as uuid } from "uuid"
import Ballot from "../../models/ballot"

export const createBallot = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { title, options } = req.body
  if (!title || !options) {
    res.status(400).json({ message: "bad request: invalid ballot" })
    return
  }
  const newBallot = new Ballot({
    title,
    options,
    adminToken: uuid(),
  })
  try {
    const dbResponse = await newBallot.save()
    res.status(201).json({ ballot: dbResponse, message: "new ballot created" })
    return
  } catch (e) {
    console.log(e.message)
    res.status(500).json({ message: "something went wrong" })
  }
}

export default createBallot
