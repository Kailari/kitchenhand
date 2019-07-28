import supertest from 'supertest'

import app from '../server'

export type TestQueryFunction = <TData = any>(query: string, headers?: { [key: string]: string }, expectedHttpResponse?: number) => Promise<TData>

const createQuery = (server: supertest.SuperTest<supertest.Test>): TestQueryFunction => {
  return async <TData = any>(
    query: string,
    headers?: { [key: string]: string },
    expectedHttpResponse?: number
  ): Promise<TData> => {
    const request = server.post('/graphql')

    if (headers) {
      for (const key in headers) {
        request.set(key, headers[key])
      }
    }

    request
      .send({ query: query || '' })
      .expect(!!expectedHttpResponse || 200)

    try {
      const result = await request
      if (result.body.errors) {
        return Promise.reject(result.body.errors)
      }

      return result.body.data
    } catch (error) {
      throw new Error(`Error creating query: ${error}`)
    }
  }
}

export const startQueryTestServer = (): TestQueryFunction => {
  const server = supertest(app)
  return createQuery(server)
}
