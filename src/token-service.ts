import {response} from "express";

const jwt = require('jsonwebtoken');

export const TokenService = {
	generateToken(payload: {login: string}) {
		return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '1h'})
	},
	// validate(token, key, data){
	// 	return
	// }
}