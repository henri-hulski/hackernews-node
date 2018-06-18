import { Context } from '../utils'

function newLinkSubscribe (parent, args, cxt: Context, info) {
  return cxt.db.subscription.link(
    { where: { mutation_in: ['CREATED'] } },
    info,
  )
}

const newLink = {
  subscribe: newLinkSubscribe
}

function newVoteSubscribe (parent, args, cxt: Context, info) {
  return cxt.db.subscription.vote(
    { where: { mutation_in: ['CREATED'] } },
    info,
  )
}

const newVote = {
  subscribe: newVoteSubscribe
}

export const Subscription = {
  newLink,
  newVote,
}
