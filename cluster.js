import express from "express"
import cluster from "cluster"
import os from "os"

const totalCPUs  = 10

const port = 3000

if (cluster.isPrimary) {
  console.log(`Number of cpu is ${totalCPUs}`)
  console.log(`Primary ${process.pid} is running`)

  for (let i = 0;  i < totalCPUs; i++) {
    cluster.fork()
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log('worker ${worker.process.pid} died')
    console.log("let's fork anotehr worker!")
    cluster.fork()
  })
} else {
  const app = express()
  console.log(`Worker ${process.pid} started`)

  app.get('/', (req, res)=> {
     res.send("Hello world")
  })

  app.get('/api/:n', (req, res) => {
    let count = req.params.n 

    if (count > 500000) count = 500000
    
    let finalcount = 0

    for (let i = 0; i < count; i++) {
      finalcount++
    }

    res.send(`final count is ${finalcount} ${process.pid}`)
  })

  app.listen(3000, ()=> {
   console.log("server is running on port 3000")
  })
}
