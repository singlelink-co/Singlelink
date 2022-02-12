import { MutationLoginArgs } from "../../src/generated-types";

const jwt = require("jsonwebtoken");

export const Mutation = {
    login: async(_: any,
        { password }: MutationLoginArgs,
        _context: any) => {
        console.log('Provided')
        console.log(password)
        console.log('Actual')
        console.log(process.env.PASSWORD)
        if(password===process.env.PASSWORD) {
            const token = jwt.sign({}, process.env.SECRET)
            // Return jwt
            return token
        }
        throw Error('Incorrect password provided, please try again.')
    }
}