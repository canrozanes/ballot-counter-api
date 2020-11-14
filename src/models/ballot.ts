import { Schema, Document, model } from "mongoose"

interface IBallotSchemaDocument extends Document {
  title: string
  options: string[]
  isComplete?: boolean
  type: "ranked" | "plurality"
  adminToken: string
}

export interface IBallot {
  title: string
  options: string[]
  isComplete?: boolean
  type: "ranked" | "plurality"
  adminToken: string
}

const BallotSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["ranked", "plurality"],
    default: "plurality",
  },
  options: [
    {
      type: String,
    },
  ],
  isComplete: {
    type: Boolean,
    default: false,
  },
  result: {
    type: String,
  },
  adminToken: {
    type: String,
  },
})

export default model<IBallotSchemaDocument>("Ballot", BallotSchema)
