import { IUser } from "./models/User"
import mongoose from 'mongoose'

type FieldsDefaultType = { [key: string]: any }

export interface IResource {
  id: any,
  owner: IUser | any | undefined,
}

export interface IMongoResource extends IResource, mongoose.Document {
  id: any
}

interface ResourceService<TResource extends IResource> {
  name: string,
  hasOwner: boolean,
  get: (id: any) => Promise<TResource | null>,
}

export interface ServiceWithCreate<TResource extends IResource, TFields = FieldsDefaultType> extends ResourceService<TResource> {
  create: (fields: TFields, owner?: IUser) => Promise<TResource | null>,
}

export interface ServiceWithUpdate<TResource extends IResource> extends ResourceService<TResource> {
  update: (id: any, updatedFields: { [key: string]: any }) => Promise<TResource | null>,
}

export interface ServiceWithRemove<TResource extends IResource> extends ResourceService<TResource> {
  remove: (id: any) => Promise<TResource | null>,
}

export interface MongoCRUDService<TResource extends IMongoResource, TFields = FieldsDefaultType> extends
  ResourceService<TResource>,
  ServiceWithCreate<TResource, TFields>,
  ServiceWithUpdate<TResource>,
  ServiceWithRemove<TResource> {
  model: mongoose.Model<TResource>,
}

let resourceServices = new Map<string, ResourceService<any>>()

const getServiceByName = <TResource extends IResource>(name: string): ResourceService<TResource> | null => {
  return resourceServices.get(name) || null
}

const asService = <
  TService extends ResourceService<TResource>,
  TResource extends IResource
>(
  service: TService
): TService => {
  console.log('creating service:', service.name)
  resourceServices.set(service.name, service)
  return service
}

interface SimpleMongoCrudServiceArgs<TResource extends IMongoResource, TFields = FieldsDefaultType> {
  name: string,
  model: mongoose.Model<TResource>,
  hasOwner?: boolean,
  populateQuery?: (query: mongoose.DocumentQuery<TResource | null, TResource>) => mongoose.DocumentQuery<TResource | null, TResource>,
  onCreate?: (created: TResource, fields: TFields, owner?: IUser) => Promise<TResource>,
  onGet?: (resource: TResource) => Promise<TResource>,
  onUpdate?: (resource: TResource, updatedFields: { [key: string]: any }) => Promise<TResource>,
  onRemove?: (resource: TResource) => Promise<TResource>,
  [key: string]: any,
}

const asSimpleMongoCRUDService = <
  TService extends MongoCRUDService<TResource, TFields>,
  TResource extends IMongoResource,
  TFields = FieldsDefaultType
>(
  args: SimpleMongoCrudServiceArgs<TResource, TFields>
): TService => {
  const create = async (fields: TFields, owner?: IUser): Promise<TResource | null> => {
    if (!!args.hasOwner && !owner) {
      throw new Error(`Error creating ${args.name}: Resource requires an owner, but none was specified!`)
    }

    const created = await new args.model(fields).save()
    return created && args.onCreate ? await args.onCreate(created, fields, owner) : created
  }

  const get = async (id: any): Promise<TResource | null> => {
    const baseQuery = args.model.findById(id)
    const query = args.populateQuery ? args.populateQuery(baseQuery) : baseQuery

    const resource = await query
    return resource && args.onGet ? await args.onGet(resource) : resource
  }

  const update = async (id: any, updatedFields: { [key: string]: any }): Promise<TResource | null> => {
    let resource = await get(id)
    if (!resource) {
      return null
    }

    for (const property in updatedFields) {
      if (resource.hasOwnProperty(property)) {
        (resource as any)[property] = updatedFields[property]
      }
    }

    if (args.onUpdate) {
      resource = await args.onUpdate(resource, updatedFields)
    }

    return await resource.save()
  }

  const remove = async (id: any): Promise<TResource | null> => {
    const baseQuery = args.model.findByIdAndDelete(id)
    const query = args.populateQuery ? args.populateQuery(baseQuery) : baseQuery

    const resource = await query
    return resource && args.onRemove ? await args.onRemove(resource) : resource
  }

  return asService<TService, TResource>({
    ...args,
    hasOwner: args.hasOwner || false,
    create,
    get,
    update,
    remove,
  } as TService)
}

export default {
  getServiceByName,
  asService,
  asSimpleMongoCRUDService
}
