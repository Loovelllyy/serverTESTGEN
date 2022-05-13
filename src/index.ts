require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

import express, { json } from 'express';
import { users } from './users';
import { TokenService } from "./token-service";
import { v4 as getId } from 'uuid';


const app = express();

app.use(json());
app.use(cookieParser());

const PORT = process.env.PORT || 3030;
const origin = process.env.NODE_ENV = `http://localhost:3000`

app.use(
	cors({
		credentials: true,
		origin,
	}),
)

app.get('/', (request, response) => {
	response.send('hi');
});

interface IBody {
	login: string,
	password: string,
}

interface ITest {
	id: string;
	nameTest: string;
	qw: {
		question: string;
		answer: string[];
	}[];
	correct: string[];
	calc?: {correct: number, incorrect: number};
}

interface ITestIWant {
	id: string;
	nameTest: string;
	qw: {
		question: string;
		answer: string[];
	}[];
	correct: [];
}

let tests: ITest[] = [];

app.post('/auth', (request, response) => {
	users.map(user => {
		if(user.login ===  request.body.login && user.password === request.body.password) {
			response.cookie('t',`${TokenService.generateToken({login: user.login})}`, {
				maxAge: 3600 * 1000,
				httpOnly: true,
				secure: false,
			});
			response.send('OK');
		}
		else {
			response.send('failed')
		}
	})
})

// const data = [{id: 1, nameTest: '1'}, {id: 2, nameTest: '2'}, {id: 3, nameTest: '3'}];
const getData = () => {
	return tests.map(el => {
		return {id: el.id, nameTest: el.nameTest}
	})
};

app.get('/getTests', (request, response) => {
	jwt.verify(request.cookies.t, process.env.JWT_ACCESS_SECRET, (err, decode) => {
		const data = getData()
		if (err) {
			response.send({data, admin: false})
		} else {
			if (decode.login) {
				response.send({data, admin: true})
			}
		}
	});
});

app.get('', (response, request) => {

})

// app.get('/123', (request, response) => {
// 	response.send('1236gjh7686jghg75');
// });

app.get('/checkedCookie', (request, response) => {
	jwt.verify(request.cookies.t, process.env.JWT_ACCESS_SECRET, (err, decode) => {
		if (!err) {
			if (decode.login) {
				response.send(true);
			}
		} else {
			response.send(false)
		}
	});
})

app.get('/deleteCookie', (request, response) => {
	if (request.cookies.t) {
		response.cookie('t',`del`, {maxAge: 0})
		response.send('ok');
	} else {
		response.send('ok');
	}

})

app.delete('/deleteTest', (request, response) => {
	tests = tests.filter(el => el.id !== request.query.id)
	response.send('ok')
})

app.post('/saveTest', (req, res,next) => {
	if(req.body.qw){
		tests.push({ id: getId(), qw: req.body.qw, correct: req.body.correct, nameTest: req.body.nameTest  })
	}
	console.log(tests)
	// res.redirect('http://localhost:3000/testListPage');
})

app.get('/getTestById', (request, response) => {
	tests.forEach(test => {

		if (test.id === request.query.id) {
			response.send({data: test.qw})
		}
	})
	response.status(404);
	// response.send({data: [
	// 		{quest: 'quest1', answersVar: ['a', 'b', 'c']},
	// 		{quest: 'quest2', answersVar: ['aa', 'bb', 'cc']},
	// 		{quest: 'quest3', answersVar: ['aa', 'bb', 'cc']},
	// 	]})
})

app.post('/postAnswer', (request, response) => {
	let correct = 0;
	let incorrect = 0;
	console.log(tests)
	tests.forEach(test => {
		console.log('test.correct', test.correct)
		console.log('request.body.values', request.body.values)
		if (test.id === request.body.id) {
			for (let i = 0; i < test.correct.length; i++) {
				// console.log(request.body.values.answers[i], test.correct[i])
				if (request.body.values.answers[i] === test.correct[i]) {
					correct++;
				}
				else incorrect++
			}
			test.calc = {correct, incorrect};
			// ↑ это будет работать некорректно в многополе !!!
		}
	})
})

app.get('/getCorrect', (request, response) => {
	tests.forEach(test => {
		if (test.id === request.query.id) {
			// console.log('calc', test.calc)
			response.send(test.calc);
		}
	})
	response.status(404)
})

app.listen(PORT, () => {
	console.log('started');
});
