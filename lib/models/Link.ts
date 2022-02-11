import client from '../connection'

const Link = {
    list: async () => {
        const links = await client.query('select * from links;')
        if(!links || !links.rows) throw Error('Failed to fetch links')
        return links.rows
    }
}

export default Link