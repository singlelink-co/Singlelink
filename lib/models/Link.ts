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
        const link = await client.query(`update links set label=$1, content=$2, position=$3, type=$4 where id=$5 returning *;`, [params.label, params.content, params.position, params.type, params.id])
        if(!link || !link.rows) throw Error('Failed to update link')
        return link.rows[0]
    },
    deleteById: async(id: number) => {
        const link = await client.query(`delete from links where id=$1 returning *;`, [id])
        if(!link || !link.rows) throw Error('Failed to delete link')
        return link.rows[0]
    },
    findNextPosition: async () => {
        const links = await Link.list()
        let highestPosition = 0;
        for(let i=0;i<links.length;i++) {
            if(links[i].position > highestPosition) highestPosition = links[i].position
        }
        return highestPosition+1
    },
    create: async(params: {label: string, content: string, type: string}) => {
        const nextPosition = await Link.findNextPosition()
        console.log(`Inserting new link at position ${nextPosition}`)
        const link = await client.query(`insert into links (label, content, type, position) values($1, $2, $3, $4)`, [params.label, params.content, params.type,nextPosition])
        if(!link || !link.rows) throw Error('Failed to create link')
        return link.rows[0]
    },
}

export default Link