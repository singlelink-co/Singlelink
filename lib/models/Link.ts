import { Link as LinkType } from '../../hooks-generated';
import client from '../connection';

const Link = {
    list: async (userId: string): Promise<LinkType[]> => {
        const [links] = await client.execute('SELECT * FROM links WHERE user_id = ? ORDER BY position;', [userId]);
        if(!links) throw Error('Failed to fetch links');
        return links as LinkType[];
    },
    // For public pages, to list links for a specific user without needing authentication for the viewer
    listPublic: async (userId: string): Promise<LinkType[]> => {
        const [links] = await client.execute('SELECT * FROM links WHERE user_id = ? ORDER BY position;', [userId]);
        if(!links) throw Error('Failed to fetch public links');
        return links as LinkType[];
    },
    findById: async (id: number, userId: string): Promise<LinkType | null> => {
        const [linkRows] = await client.execute('SELECT * FROM links WHERE id=? AND user_id=?;', [id, userId]);
        const links = linkRows as LinkType[];
        if(!links || links.length === 0) return null; // Or throw Error('Link not found or unauthorized')
        return links[0];
    },
    updateById: async(params: {label?: string | null, content?: string | null, id: number, position: number, type: string}, userId: string): Promise<LinkType> => {
        const existingLink = await Link.findById(params.id, userId);
        if (!existingLink) throw new Error('Link not found or not authorized to update this link.');

        const [update] = await client.execute(`UPDATE links SET label=?, content=?, position=?, type=? WHERE id=? AND user_id=?;`, [params.label, params.content, params.position, params.type, params.id, userId]);
        if(!update || (update as any).affectedRows < 1) throw Error('Failed to update link');
        const link = await Link.findById(params.id, userId);
        if (!link) throw new Error('Failed to fetch updated link details.'); // Should not happen if update was successful
        return link;
    },
    deleteById: async(id: number, userId: string): Promise<LinkType> => {
        const link = await Link.findById(id, userId);
        if(!link) throw Error('Link not found or not authorized to delete this link.');
        const [deleted] = await client.execute(`DELETE FROM links WHERE id=? AND user_id=?;`, [id, userId]);
        if(!deleted || (deleted as any).affectedRows < 1) throw Error('Failed to delete link');
        return link; // Return the link that was deleted
    },
    findNextPosition: async (userId: string): Promise<number> => {
        const links = await Link.list(userId);
        let highestPosition = -1; // Initialize to -1 so if no links, next position is 0
        for(let i=0;i<links.length;i++) {
            if(links[i].position > highestPosition) highestPosition = links[i].position;
        }
        return highestPosition + 1;
    },
    create: async(params: {label?: string | null, content?: string | null, type: string}, userId: string): Promise<LinkType> => {
        const nextPosition = await Link.findNextPosition(userId);
        console.log(`Inserting new link for user ${userId} at position ${nextPosition}`);
        const [inserted] = await client.execute(`INSERT INTO links (label, content, type, position, user_id) VALUES(?, ?, ?, ?, ?)`, [params.label, params.content, params.type, nextPosition, userId]);
        const insertResult = inserted as any;
        if(!insertResult || insertResult.affectedRows < 1) throw Error('Failed to create link');
        const newLink = await Link.findById(insertResult.insertId, userId); // Fetch by insertId and userId
        if(!newLink) throw Error('Failed to find new link.');
        return newLink;
    },
    reorder: async(id: number, newIndex: number, oldIndex: number, userId: string): Promise<LinkType[]> => {
        // First, verify the link being moved belongs to the user
        const linkToMove = await Link.findById(id, userId);
        if (!linkToMove) {
            throw new Error("Link to reorder not found or user not authorized.");
        }

        let [queryResult] = await client.execute("SELECT * FROM links WHERE user_id = ? ORDER BY position", [userId]);
        const linkRows = queryResult as LinkType[];

        if (linkRows.length < 1) throw Error('Links not found to reorder for this user');
        let linkRowToMove: LinkType | undefined;
  
        // Find the specific link to move from the fetched list (ensuring it's the user's link)
        const actualOldIndex = linkRows.findIndex(lr => lr.id === id);
        if (actualOldIndex === -1) {
            throw new Error("Link to reorder not found in user's links list.");
        }
        linkRowToMove = linkRows[actualOldIndex];

        if (linkRowToMove) {
            // Remove from old position
            linkRows.splice(actualOldIndex, 1);
            // Insert at new position
            linkRows.splice(newIndex, 0, linkRowToMove);
        } else {
            throw new Error("Could not find the link to reorder.");
        }
  
        // Update positions in DB
        for (let i = 0; i < linkRows.length; i++) {
            linkRows[i].position = i; // Update position in the local array
            // Update position in DB, ensuring it's still the user's link (though check might be redundant if list was pre-filtered)
            await client.execute("UPDATE links SET position=? WHERE id=? AND user_id=?", [i, linkRows[i].id, userId]);
        }
        // Return the reordered list of links for the user
        return Link.list(userId);
    }
};

export default Link;