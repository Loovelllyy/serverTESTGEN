require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

import express, { json } from 'express';
import { tests } from "./testsBD";
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
			console.log(request.body)
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
	console.log(request.cookies)
	jwt.verify(request.cookies.t, process.env.JWT_ACCESS_SECRET, (err, decode) => {
		console.log(decode)
		if (!err) {
			if (decode.login) {
				console.log('token is valid')
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

})

app.post('/saveTest', (req, res) => {
	console.log(req.body);
	if(req.body.qw){
		tests.push({ id: getId(), qw: req.body.qw, nameTest: req.body.nameTest  })
	}
	res.send({tests});
})


app.listen(PORT, () => {
	console.log('started');
});
