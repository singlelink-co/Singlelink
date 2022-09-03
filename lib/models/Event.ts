import client from '../connection'

const Event = {
    create: async(type: 'click' | 'view', link_id?: string) => {
        const [insert] = !link_id ? await client.query(`insert into events (type) values(?)`, [type]) : await client.query(`insert into events (type, link_id) values(?, ?);`, ['click', link_id])
        console.log(insert)
        if(!insert || insert.affectedRows < 1) throw Error('Failed to create link')
        const event = await client.query(`select * from events where id=?`, [insert.insertId])
        return event[0]
    },
    fetchOverview: async() => {
        const [overview] = await client.query(`
        select
            count(case when type = 'view' then 1 else null end) as views,
            count(case when type = 'click' then 1 else null end) as clicks,
            DATE(created_at) as date
        from events
        where created_at >= SUBDATE(CURDATE(), 7)
        group by DATE(created_at);
        `)
        if(!overview) throw Error('Failed to fetch overview')
        return overview
    }
}

export default Event