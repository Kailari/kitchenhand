import { IUser } from '../models/User'

import ResourceManager from './resourceManager'

export interface FieldsDefaultType {
  [key: string]: any,
}

export interface Resource {
  id: ID,
}

export interface Service {
  name: string,
}

export interface ServiceWithGetOwner extends Service {
  getOwner: (id: ID) => Promise<IUser | null>,
}

export interface ServiceWithGetOwnerId extends Service {
  getOwnerId: (id: ID) => Promise<ID | null>,
}

export interface ServiceWithGet<TResource extends Resource> extends Service {
  get: (id: ID) => Promise<TResource | null>,
}

export interface ServiceWithCreate<TResource extends Resource, TFields = FieldsDefaultType> extends Service {
  create: (fields: TFields) => Promise<TResource | null>,
}

export interface ServiceWithUpdate<TResource extends Resource> extends Service {
  update: (id: ID, updatedFields: { [key: string]: any }) => Promise<TResource | null>,
}

export interface ServiceWithRemove<TResource extends Resource> extends Service {
  remove: (id: ID) => Promise<TResource | null>,
}

export abstract class ResourceService implements Service {
  public name: string

  public constructor(name: string) {
    this.name = name

    ResourceManager.register(name, this)
  }
}
