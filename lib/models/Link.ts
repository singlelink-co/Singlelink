import client from '../connection'

const Link = {
    list: async () => {
        const links = await client.query('select * from links;')
        if(!links || !links.rows) throw Error('Failed to fetch links')
        return links.rows
    },
    findById: async (id: number) => {
        const link = await client.query('select * from links where id=$1;', [id])
        if(!link || !link.rows) throw Error('Failed to fetch link')
        return link.rows[0]
    },
    updateById: async(params: {label: string, content: string, id: number, position: number, type: string}) => {
        const link = await client.query(`update links set label=$1, content=$2, position=$3, type=$4 where id=$5`, [params.label, params.content, params.position, params.type, params.id])
        if(!link || !link.rows) throw Error('Failed to fetch link')
        return link.rows[0]
    }
}

export default Link