const getWinner = (votes: string[]): { winner: string; count: number } => {
  const counts: { [key: string]: number } = {}
  votes.forEach((vote) => {
    if (!(vote in counts)) {
      counts[vote] = 1
    } else {
      counts[vote] += 1
    }
  })

  let maxCount = 0
  let winner: string
  const entries = Object.entries(counts)
  for (let i = 0; i < entries.length; i++) {
    const candidate = entries[i][0]
    const voteCount = entries[i][1]
    if (voteCount > maxCount) {
      maxCount = voteCount
      winner = candidate
    }
  }
  return {
    winner,
    count: maxCount,
  }
}

export default getWinner
