const mongoose = require('mongoose')

if (process.argv.length < 3) {
	console.log('give password as argument')
	process.exit(1)
}



const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://lucianlavric2005:${password}@phonebookcluster.xeiul1n.mongodb.net/?retryWrites=true&w=majority&appName=PhonebookCluster`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length == 3) {
	Person.find({}).then(result => {
		result.forEach(person => {
			console.log(person)
		})
		mongoose.connection.close()
	})

}

else if (process.argv.length == 5) {
	const person = new Person({
		name: `${name}`,
		number: `${number}`,
	})

	person.save().then(result => {
		console.log(`added ${name} number ${number} to the phonebook!`)
		mongoose.connection.close()
	})
}



/*
Person.find({}).then(result => {
	result.forEach(person => {
		console.log(person)
	})
	mongoose.connection.close()
}) 
*/
