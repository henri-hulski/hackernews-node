import { Context } from '../utils'

export const Query = {
  feed: async (parent, args, ctx: Context, info) => {
    const where = args.filter
      ? {
          OR: [
            { url_contains: args.filter },
            { description_contains: args.filter },
          ],
        }
      : {}

    const queriedLinks = await ctx.db.query.links(
      { where, skip: args.skip, first: args.first, orderBy: args.orderBy },
      `{ id }`,
    )

    const countSelectionSet = `
      {
        aggregate {
          count
        }
      }
    `

    const linksConnection = await ctx.db.query.linksConnection({}, countSelectionSet)

    return {
      count: linksConnection.aggregate.count,
      linkIds: queriedLinks.map(link => link.id),
    }
  },

  link: (parent, { id }, ctx: Context, info) => {
    return ctx.db.query.link({ where: { id }, }, info)
  },
}
