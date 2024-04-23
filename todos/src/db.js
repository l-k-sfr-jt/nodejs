import knex from 'knex';
import knexfile from '../knexfile.js';

const env = process.env.NODE_ENV ?? "development";

export const db = knex(knexfile[env]);

export const getAllTodos = async () => {
    return db('todos').select('*');
}

export const getTodoById = async (id) => {
    return db('todos').select('*').where('id', id).first();
}
