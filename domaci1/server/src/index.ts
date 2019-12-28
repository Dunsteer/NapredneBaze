import app from './App'

const port = process.env.PORT || 3000


app.listen(port, '0.0.0.0', (err:Error) => {
  if (err) {
    return console.log(err)
  }

  return console.log(`Server is listening on ${port}`)
})