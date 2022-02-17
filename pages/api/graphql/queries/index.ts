import Link from '../../../../lib/models/Link'
import Event from '../../../../lib/models/Event'

export const Query = {
    hello : async () => {
        console.log('hello')
        return 'hello'
    },
    listLinks: async (_: any, _params: any, context: { isAuthorized: boolean }) => {
        if(context.isAuthorized === false) throw Error('Must be authorized to use the Dashboard.')
        const links = await Link.list()
        return links
    },
    findLinkById: async (_ : any, { id }: { id: number }, context: { isAuthorized: boolean }) => {
        if(!context.isAuthorized) throw Error('Must be authorized to use the Dashboard.')
        const link = await Link.findById(id)
        return link
    },
    fetchOverview: async(_: any, _params: any, context: {isAuthorized: boolean}) => {
        if(!context.isAuthorized) throw Error('Must be authorized to use the Dashboard.')
        const overview = await Event.fetchOverview()
        return overview
    }
}