import { MutationLoginArgs } from "../../src/generated-types";

const jwt = require("jsonwebtoken");

export const Mutation = {
    login: async(_: any,
        { password }: MutationLoginArgs,
        _context: any) => {
        if(password===process.env.PASSWORD) {
            const token = jwt.sign({}, process.env.SECRET)
            // Return jwt
            return token
        }
        throw Error('Incorrect password provided, please try again.')
    },
    verify: async(_: any,
        params: { jwt: any; },
        _context: any) => {
            const decoded = jwt.verify(params.jwt, process.env.SECRET)
            return params.jwt
        }
}