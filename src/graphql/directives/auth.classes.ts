/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { SchemaDirectiveVisitor, AuthenticationError, ApolloError } from 'apollo-server'
import { defaultFieldResolver, GraphQLField } from 'graphql'

import ResourceManager from '../../resources'
import { Context } from '../../server'
import { UserPermissions } from '../../generated/graphql'
import { IUser } from '../../models/User'

class RequirePermissionsDirective extends SchemaDirectiveVisitor {
  public visitFieldDefinition(field: GraphQLField<any, Context>) {
    const { resolve = defaultFieldResolver } = field
    const required: UserPermissions[] = this.args.permissions

    field.resolve = async (source, args, context, info) => {
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
  public visitFieldDefinition(field: GraphQLField<any, Context>) {
    const { resolve = defaultFieldResolver } = field

    field.resolve = async (source, args, context, info) => {
      if (!context.currentUser) {
        throw new AuthenticationError('Not authenticated')
      }

      return await resolve.call(this, source, args, context, info)
    }
  }
}

class OwnerOnlyDirective extends SchemaDirectiveVisitor {
  private isSuperUser(user: IUser): boolean {
    return user.permissions.includes(UserPermissions.Superuser)
  }

  private isCurrentUserSuper(context: Context): boolean {
    return !!context.currentUser && this.isSuperUser(context.currentUser)
  }

  public visitFieldDefinition(field: GraphQLField<any, Context>) {
    const { resolve = defaultFieldResolver } = field
    const resourceTypeName: string = this.args.resourceType
    const idArgName: string = this.args.idArgName
    const allowSuperUser: boolean = this.args.canSuperUserAccess

    const resourceType = ResourceManager.getServiceByName(resourceTypeName)
    if (!resourceType) {
      throw new Error(`Error in schema, invalid resource type "${resourceTypeName}"`)
    }

    if (!resourceType.hasOwner) {
      throw new Error(`Error in schema, @onlyOwner on resource of type "${resourceTypeName}", but the resource type does not have owner`)
    }

    field.resolve = async (source, args, context, info) => {
      if (!context.currentUser) {
        throw new AuthenticationError('Not authenticated')
      }

      const { [idArgName]: id } = args
      const resource = await resourceType.get(id)
      if (!resource) {
        throw new ApolloError(`Invalid resourece ID "${id}" for resource of type "${resourceTypeName}"`, 'BAD_ID')
      }

      const isOwner = resource.owner && resource.owner.id === context.currentUser.id
      const canAccessAsSuperUser = allowSuperUser && this.isCurrentUserSuper(context)

      if (!isOwner && !canAccessAsSuperUser) {
        throw new AuthenticationError('Only owner can access this resource')
      }

      return await resolve.call(this, source, args, context, info)
    }
  }
}

export default {
  requirePermissions: RequirePermissionsDirective,
  requireLogin: RequireLoginDirective,
  ownerOnly: OwnerOnlyDirective,
}
