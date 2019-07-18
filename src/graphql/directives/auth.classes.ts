import { SchemaDirectiveVisitor, AuthenticationError } from 'apollo-server'
import { defaultFieldResolver, GraphQLField } from 'graphql'
import { Context } from '../../server'
import { UserPermissions } from '../../generated/graphql'

class RequirePermissionsDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field: GraphQLField<any, Context>) {
    const { resolve = defaultFieldResolver } = field
    const required: UserPermissions[] = this.args.permissions

    field.resolve = async (
      source,
      args,
      context,
      info
    ) => {
      if (!context.currentUser) {
        throw new AuthenticationError('Not authenticated')
      }

      const { currentUser } = context

      if (required.length > 0 && !required.every((permission) => currentUser.permissions.includes(permission))) {
        throw new AuthenticationError('Insufficient permissions')
      }

      return await resolve.call(this, source, args, context, info)
    }
  }
}

class RequireLoginDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field: GraphQLField<any, Context>) {
    const { resolve = defaultFieldResolver } = field

    field.resolve = async (
      source,
      args,
      context,
      info
    ) => {
      if (!context.currentUser) {
        throw new AuthenticationError('Not authenticated')
      }

      return await resolve.call(this, source, args, context, info)
    }
  }
}

export default {
  requirePermissions: RequirePermissionsDirective,
  requireLogin: RequireLoginDirective,
}
