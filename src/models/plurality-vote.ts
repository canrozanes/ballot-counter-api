import { Schema, Document, model } from "mongoose"

interface IPluralityVote extends Document {
  type: Schema.Types.ObjectId
  choice: string
}

const PluralityVoteSchema = new Schema({
  type: {
    type: String,
  },
  choice: String,
})

export default model<IPluralityVote>("PluralityVote", PluralityVoteSchema)
