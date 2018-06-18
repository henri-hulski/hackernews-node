import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { APP_SECRET, getUserId, Context } from '../utils'

export const Mutation = {
  signup: async (parent, args, ctx: Context, info) => {
    const password = await bcrypt.hash(args.password, 10)
    const user = await ctx.db.mutation.createUser({
      data: { ...args, password },
    }, `{ id }`)

    const token = jwt.sign({ userId: user.id }, APP_SECRET)

    return {
      token,
      user,
    }
  },

  login: async (parent, { email, password }, ctx: Context, info) => {
    const user = await ctx.db.query.user({ where: { email } }, ` { id password } `)
    if (!user) {
      throw new Error('No such user found')
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      throw new Error('Invalid password')
    }

    const token = jwt.sign({ userId: user.id }, APP_SECRET)

    return {
      token,
      user,
    }
  },

  post: (parent, { url, description }, ctx: Context, info) => {
    const userId = getUserId(ctx)
    return ctx.db.mutation.createLink(
      {
        data: {
          url,
          description,
          postedBy: { connect: { id: userId } },
        },
      },
      info,
    )
  },

  updateLink: (parent, { id, url, description }, ctx: Context, info) => {
    const userId = getUserId(ctx)
    return ctx.db.mutation.updateLink({
      where: {
        id,
      },
      data: {
        url,
        description,
      },
    }, info)
  },

  deleteLink: (parent, { id }, ctx: Context, info) => {
    const userId = getUserId(ctx)
    return ctx.db.mutation.deleteLink({
      where: {
        id,
      },
    }, info)
  },

  vote: async (parent, { linkId }, cxt: Context, info) => {
    const userId = getUserId(cxt)

    const linkExists = await cxt.db.exists.Vote({
      user: { id: userId },
      link: { id: linkId },
    })
    if (linkExists) {
      throw new Error(`Already voted for link: ${linkId}`)
    }

    return cxt.db.mutation.createVote(
      {
        data: {
          user: { connect: { id: userId } },
          link: { connect: { id: linkId } },
        },
      },
      info,
    )
  },
}
