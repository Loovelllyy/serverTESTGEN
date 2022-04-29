import {users as usersDB} from './users.json';

interface IData {
	login: string,
	password: string
}

export const users: IData[] = usersDB