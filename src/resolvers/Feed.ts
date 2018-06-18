import { Context } from '../utils'

export const Feed = {
  links: (parent, args, ctx: Context, info) => {
    return ctx.db.query.links({ where: { id_in: parent.linkIds } }, info)
  }
}
