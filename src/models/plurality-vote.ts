import { Schema, Document, model } from "mongoose"

interface IPluralityVote extends Document {
  type: Schema.Types.ObjectId
  choice: string
}

const PluralityVoteSchema = new Schema({
  ballot: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Ballot",
  },
  choice: String,
})

export default model<IPluralityVote>("PluralityVote", PluralityVoteSchema)
