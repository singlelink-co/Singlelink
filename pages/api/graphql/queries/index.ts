import Link from '../../../../lib/models/Link'

export const Query = {
    hello : async () => {
        console.log('hello')
        return 'hello'
    },
    listLinks: async () => {
        const links = await Link.list()
        return links
    }
}