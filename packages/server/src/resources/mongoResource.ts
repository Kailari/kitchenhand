import mongoose, { DocumentQuery } from 'mongoose'

import { Resource, ServiceWithGet, ServiceWithCreate, ServiceWithUpdate, ServiceWithRemove, ResourceService } from './resource'


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
    return await new this.model(fields).save()
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
      if (resource.hasOwnProperty(property)) {
        (resource as any)[property] = updatedFields[property]
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
