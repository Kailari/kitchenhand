# Kitchenhand [![Build Status](https://travis-ci.org/Kailari/kitchenhand.svg?branch=master)](https://travis-ci.org/Kailari/kitchenhand)
Simple recipebook-app for storing your recipes and scheduling weekly menu.

[Link to app on Heroku](https://kitchenhand.herokuapp.com)

[Link to timecard](/documentation/tuntikirjanpito.md) (aproximate hours spent working with the project, for grading)

## Planned Features
- Personal recipebook
- Sharing recipes with other users
- Automatic unit conversions (e.g. oz -> g, dl -> cup)
- Shopping list helper
- Weekly menu scheduler/helper

## Stack
### Frontend
- React (bootstrapped with *Create-react-app*)
- ReactApollo
- Semantic UI React

### Backend
- [ApolloServer](https://www.apollographql.com/docs/apollo-server/) for GraphQL endpoint
- [Express](https://expressjs.com/) for serving front
- [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/)
- [GraphQL Code Generator](https://graphql-code-generator.com/)

### Build/Deploy pipeline
- TravisCI
- Jest + jest-extended + jest-dom + react-testing-library
- Cypress
