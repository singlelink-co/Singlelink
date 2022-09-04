import Link from "../../../../lib/models/Link";
import Event from "../../../../lib/models/Event";
import { MutationLoginArgs } from "../../src/generated-types";

const jwt = require("jsonwebtoken");

export const Mutation = {
    login: async(_: any,
        { password }: MutationLoginArgs,
        _context: any) => {
        if(password===process.env.PASSWORD) {
            const token = jwt.sign({}, process.env.SECRET,
                {
                    expiresIn: '24h'
                })
            // Return jwt
            return token
        } else {
            throw Error(`Incorrect password provided, please try again.`)
        }
    },
    verify: async(_: any,
        params: { jwt: any; },
        _context: any) => {
            const decoded = jwt.verify(params.jwt, process.env.SECRET)
            return params.jwt
    },
    createLink: async(_: any,
        params: { label: string, content: string, type: string}, { isAuthorized }: { isAuthorized: boolean }) => {
            if(!isAuthorized) throw Error('Must be authorized to use the Dashboard.')
            const link = await Link.create(params)
            return link
    },
    updateLinkById: async(_: any,
        params: { label: string, content: string, id: number, position: number, type: string}, { isAuthorized }: { isAuthorized: boolean }) => {
            if(!isAuthorized) throw Error('Must be authorized to use the Dashboard.')
            const updatedLink = Link.updateById(params)
            return updatedLink
    },
    deleteLinkById: async(_: any,
        { id}: { id: number }, { isAuthorized }: { isAuthorized: boolean }) => {
            if(!isAuthorized) throw Error('Must be authorized to use the Dashboard.')
            const link = Link.deleteById(id)
            return link
    },
    reorderLink: async(_: any,
        { id, newIndex, oldIndex }: { id: number, newIndex: number, oldIndex: number },
        { isAuthorized }: {isAuthorized: boolean}) => {
            if(!isAuthorized) throw Error('Must be authorized to use the Dashboard.')
            const links = await Link.reorder(id, newIndex, oldIndex)
            return links
    },
    createEvent: async(_: any, { type } : { type: 'view' | 'click' }, context: {isAuthorized: boolean}) => {
        const event = await Event.create(type)
        return event
    }
}