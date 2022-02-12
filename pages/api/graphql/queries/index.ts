import Link from '../../../../lib/models/Link'

export const Query = {
    hello : async () => {
        console.log('hello')
        return 'hello'
    },
    listLinks: async (_: any, _params: any, context: { isAuthorized: boolean }) => {
        console.log(context)
        if(context.isAuthorized === false) throw Error('Must be authorized to use the Dashboard.')
        const links = await Link.list()
        return links
    }
}