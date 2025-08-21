require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')


app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))
app.use(express.static('dist'))


morgan.token('type', function(req, res) { return JSON.stringify(req.body) })


let persons = []

app.get('/', (req, res) => {
	res.send('GET request to the homepage')
})

app.get('/api/persons', (req, res) => {
	Person.find({}).then(person => {
		res.json(person)
	})
})

app.get('/info', (req, res) => {
	let size
	Person.countDocuments({})
		.then(count => {
			size = count
			console.log('Total people:', count);
			res.send(`
<p>phonebook has info for ${size} people</p>
<p>${date}</p>
`)

		})
		.catch(error => {
			console.error('Error:', error);
		}); const date = new Date()
})

app.get('/api/persons/:id', (request, response, next) => {
	Person.findById(request.params.id).then(
		person => {
			if (person) {
				response.json(person)
			} else {
				response.status(404).end()
			}
		}
	)
		.catch(error => next(error)
		)
})


const generateId = () => {
	const maxId = persons.length > 0
		? Math.max(...persons.map(n => Number(n.id)))
		: 0
	return String(maxId + 1)
}

app.post('/api/persons', (request, response) => {
	const body = request.body
	console.log(body)

	if (!body.name) {
		return response.status(400).json({
			error: 'name missing'
		})
	}

	if (!body.number) {
		return response.status(400).json({
			error: 'number missing'
		})
	}

	if (persons.find(person => person.name === body.name)) {
		return response.status(400).json({
			error: `${body.name} is already in the database`
		})
	}

	const person = new Person({
		name: body.name,
		number: body.number,
		id: generateId(),
	})

	console.log("this is the person" + person)

	person.save().then(savedPerson => {
		response.json(savedPerson)
	})
})

app.delete('/api/persons/:id', (request, response, next) => {
	console.log("request params.id is", request.params.id)
	Person.findByIdAndDelete(request.params.id)
		.then(result => {
			response.status(204).end()
		})
		.catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
	const { name, number } = request.body

	Person.findById(request.params.id)
		.then(person => {
			if (!person) {
				return response.status(404).end()
			}

			person.name = name
			person.number = number

			return person.save().then((updatedPerson) => {
				response.json(updatedPerson)
			})
		})
		.catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
	console.error(error.message)

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	}

	next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
