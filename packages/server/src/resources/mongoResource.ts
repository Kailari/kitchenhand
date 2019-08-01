import mongoose, { DocumentQuery } from 'mongoose'

import { Resource, ServiceWithGet, ServiceWithCreate, ServiceWithUpdate, ServiceWithRemove, ResourceService } from './resource'
import { ValidationError } from 'validators'


export interface MongoResource extends Resource, mongoose.Document {
  id: ID,
}

export type ArgumentTypes<T> = T extends (...args: infer U) => infer R ? U : never
export type ReplaceReturnType<T, TNewReturn> = (...a: ArgumentTypes<T>) => TNewReturn

export type WithMongoServiceVariantQuery<TBase, TResource extends MongoResource, KFunc extends keyof TBase, KQuery extends string> = {
  [key in KQuery]: ReplaceReturnType<TBase[KFunc], DocumentQuery<TResource | null, TResource>>
}

export type MongoServiceVariant<TBase, TResource extends MongoResource, KFunc extends keyof TBase, KQuery extends string> =
  TBase & WithMongoServiceVariantQuery<TBase, TResource, KFunc, KQuery> & {
    model: mongoose.Model<TResource>,
  }

export type MongoServiceWithGet<TResource extends MongoResource> =
  MongoServiceVariant<ServiceWithGet<TResource>, TResource, 'get', 'getQuery'>

export type MongoServiceWithUpdate<TResource extends MongoResource> =
  MongoServiceVariant<ServiceWithUpdate<TResource>, TResource, 'update', 'updateQuery'>

export type MongoServiceWithRemove<TResource extends MongoResource> =
  MongoServiceVariant<ServiceWithRemove<TResource>, TResource, 'remove', 'removeQuery'>


export class MongoResourceService<TResource extends MongoResource> extends ResourceService {
  public model: mongoose.Model<TResource>

  public constructor(name: string, model: mongoose.Model<TResource>) {
    super(name)

    this.model = model
  }
}

export class MongoCRUDService<TResource extends MongoResource, TFields = { [key: string]: any }> extends MongoResourceService<TResource> implements
  ServiceWithCreate<TResource, TFields>,
  MongoServiceWithGet<TResource>,
  MongoServiceWithUpdate<TResource>,
  MongoServiceWithRemove<TResource> {

  public async create(fields: TFields): Promise<TResource | null> {
    try {
      return await new this.model(fields).save()
    } catch (err) {
      // HACK: as validating uniqueness of document fields cannot be done without
      //       a roundtrip to the DB, catch DB validation error concerning non-unique
      //       paths and convert them to validator errors. This way, frontend sees
      //       the non-unique error as just another validator error.
      if (err.errors !== undefined) {
        const parentError = err as mongoose.Error.ValidationError
        const errors = []
        for (const path in parentError.errors) {
          const error = parentError.errors[path]
          if (error.name === 'ValidatorError' && error.kind === 'unique') {
            errors.push({
              path: path,
              error: `error.validation.${path}.must_be_unique`,
            })
          }
        }
        throw new ValidationError(errors)
      }

      throw err
    }
  }

  public async get(id: ID): Promise<TResource | null> {
    return await this.getQuery(id)
  }

  public getQuery(id: ID): DocumentQuery<TResource | null, TResource> {
    return this.model.findById(id)
  }

  public async update(id: ID, updatedFields: { [key: string]: any }): Promise<TResource | null> {
    const resource = await this.updateQuery(id)
    if (!resource) {
      return null
    }

    for (const property in updatedFields) {
      // HACK: Convert null values to undefined in order to remove fields from documents
      const value = updatedFields[property] || undefined
      if (property in resource) {
        resource.set(property, value)
      }
    }

    return await resource.save()
  }

  public updateQuery(id: ID): DocumentQuery<TResource | null, TResource> {
    return this.model.findById(id)
  }

  public async remove(id: ID): Promise<TResource | null> {
    return await this.removeQuery(id)
  }

  public removeQuery(id: ID): DocumentQuery<TResource | null, TResource> {
    return this.model.findByIdAndDelete(id)
  }
}
