import client from '../connection'

const Event = {
    create: async(type: 'click' | 'view') => {
        const event = await client.query(`insert into events (type) values($1)`, [type])
        if(!event || !event.rows) throw Error('Failed to create link')
        return event.rows[0]
    },
    fetchOverview: async() => {
        const overview = await client.query(`
        select
            count(case when type = 'view' then 1 else null end) as views,
            count(case when type = 'click' then 1 else null end) as clicks,
            DATE(created_at) as date
        from events
        where created_at >= NOW() - INTERVAL '7 days'
        group by DATE(created_at);
        `)
        if(!overview || !overview.rows) throw Error('Failed to fetch overview')
        return overview.rows
    }
}

export default Event