/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { SchemaDirectiveVisitor, AuthenticationError, ApolloError } from 'apollo-server'
import { defaultFieldResolver, GraphQLField } from 'graphql'

import ResourceManager from '../../resources/resourceManager'
import { Context } from '../../server'
import { UserPermissions } from '../../generated/graphql'
import { IUser } from '../../models/User'
import { ServiceWithGetOwner, ServiceWithGetOwnerId } from '../../resources/resource'
import { doValidation, validator } from 'validators'

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
    const idArgName: string = this.args.idArg
    const allowSuperUser: boolean = this.args.canSuperUserAccess

    const resourceType = ResourceManager.getServiceByName(resourceTypeName)
    if (!resourceType) {
      throw new Error(`Error in schema, invalid resource type "${resourceTypeName}"`)
    }

    const hasGetOwner = (resourceType as ServiceWithGetOwner).getOwner !== undefined
    const hasGetOwnerId = (resourceType as ServiceWithGetOwnerId).getOwnerId !== undefined
    const hasOwnerAccessor = hasGetOwner || hasGetOwnerId

    if (!hasOwnerAccessor) {
      throw new Error(`Error in schema, @onlyOwner on resource of type "${resourceTypeName}", but the resource type does not have accessor for owner!`)
    }

    field.resolve = async (source, args, context, info) => {
      if (!context.currentUser) {
        throw new AuthenticationError('Not authenticated')
      }

      doValidation(args, [
        validator.isValidId(idArgName)
      ])

      const id = args[idArgName]
      const ownerId = hasGetOwnerId
        ? await (resourceType as ServiceWithGetOwnerId).getOwnerId(id)
        : await (async () => {
          const owner = await (resourceType as ServiceWithGetOwner).getOwner(id)
          return owner ? owner.id : null
        })()

      if (!ownerId) {
        throw new ApolloError(`Invalid resource ID "${id}" for resource of type "${resourceTypeName}"`, 'BAD_ID')
      }

      const isOwner = ownerId == context.currentUser.id
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
