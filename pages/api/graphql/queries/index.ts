import Link from '../../../../lib/models/Link';
import Event from '../../../../lib/models/Event';
import { Session } from 'next-auth'; // Import Session type

interface ResolverContext {
  session: Session | null; // Or your specific session type
  isAuthorized: boolean; // Keep if still used, or derive from session
}

export const Query = {
    hello : async () => {
        console.log('hello');
        return 'hello';
    },
    listLinks: async (_: any, _params: any, context: ResolverContext) => {
        if (!context.session?.user?.id) throw new Error('Authentication required.');
        const links = await Link.list(context.session.user.id);
        return links;
    },
    // Resolver for public link listing, takes a userId argument
    listPublicLinks: async (_: any, { userId }: { userId: string }) => {
        // No authentication check here, as it's for public pages
        if (!userId) throw new Error('User ID is required to fetch public links.');
        const links = await Link.listPublic(userId); // Using the new listPublic model function
        return links;
    },
    findLinkById: async (_ : any, { id }: { id: number }, context: ResolverContext) => {
        if (!context.session?.user?.id) throw new Error('Authentication required.');
        const link = await Link.findById(id, context.session.user.id);
        if (!link) throw new Error('Link not found or not authorized.');
        return link;
    },
    fetchOverview: async(_: any, _params: any, context: ResolverContext) => {
        if (!context.session?.user?.id) throw new Error('Authentication required.');
        const overview = await Event.fetchOverview(context.session.user.id);
        return overview;
    }
};