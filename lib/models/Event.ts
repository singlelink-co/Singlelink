import client from '../connection';
import { Event as EventType } from '../../hooks-generated'; // Assuming EventType might be useful

const Event = {
    create: async(type: 'click' | 'view', userId: string, link_id?: string): Promise<EventType> => {
        // If link_id is provided, it's a 'click' event on a specific link owned by userId.
        // If link_id is not provided, it's a 'view' event on the user's profile page (owned by userId).
        const [insertRows] = await client.execute(
            `INSERT INTO events (type, user_id, link_id) VALUES(?, ?, ?);`,
            [type, userId, link_id ?? null]
        );
        const insertResult = insertRows as any;
        if(!insertResult || insertResult.affectedRows < 1) throw Error('Failed to create event');

        // Fetch the created event to return it (optional, but good practice)
        const [eventRows] = await client.execute('SELECT * FROM events WHERE id = ?', [insertResult.insertId]);
        const events = eventRows as EventType[];
        if (!events || events.length === 0) throw Error('Failed to fetch created event.');
        return events[0];
    },
    fetchOverview: async(userId: string): Promise<any[]> => { // Return type can be more specific
        const [overviewRows] = await client.execute(`
        SELECT
            COUNT(CASE WHEN type = 'view' THEN 1 ELSE NULL END) as views,
            COUNT(CASE WHEN type = 'click' THEN 1 ELSE NULL END) as clicks,
            DATE(created_at) as date
        FROM events
        WHERE user_id = ? AND created_at >= SUBDATE(CURDATE(), 7)
        GROUP BY DATE(created_at)
        ORDER BY DATE(created_at) ASC;
        `, [userId]);
        const overview = overviewRows as any[]; // Cast to any[] or a more specific type
        if(!overview) throw Error('Failed to fetch overview'); // Or return empty array if that's preferred for no data
        return overview;
    }
};

export default Event;