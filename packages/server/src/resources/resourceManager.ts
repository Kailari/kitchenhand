import { Service } from './resource'

const services = new Map<string, Service>()

const register = (name: string, service: Service): void => {
  console.log('creating service:', name)
  services.set(name, service)
}

const getServiceByName = (name: string): Service | null => {
  return services.get(name) || null
}

export default {
  register,
  getServiceByName
}
