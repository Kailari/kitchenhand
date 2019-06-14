const handleError = ({ setLoginnameError, setNameError, setPasswordError }) =>
  (error) => {
    if (!error || !error.graphQLErrors || error.graphQLErrors.length === 0) {
      return
    }

    const invalidArgs = error.graphQLErrors[0].extensions.exception.invalidArgs
    if (setLoginnameError && invalidArgs.includes('loginname')) {
      if (error.message.includes('expected `loginname` to be unique')) {
        setLoginnameError('Name already taken')
      } else if (error.message.includes('`loginname` is required')) {
        setLoginnameError('Please enter a login name')
      } else if (!error.message.includes('Bad loginname or password')) {
        setLoginnameError('Login name must be 5-32 characters long')
      }
    }

    if (setNameError && invalidArgs.includes('name')) {
      if (error.message.includes('`name` is required')) {
        setNameError('A display name is required')
      } else {
        setNameError('Name must be 3-64 characters long')
      }
    }

    if (setPasswordError && invalidArgs.includes('password')) {
      if (error.message.includes('Bad loginname or password')) {
        setPasswordError('Bad loginname or password')
      }
      else {
        setPasswordError('Invalid password')
      }
    }
  }

export default handleError