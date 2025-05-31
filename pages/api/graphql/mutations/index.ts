import Link from "../../../../lib/models/Link";
import Event from "../../../../lib/models/Event";
import { Session } from 'next-auth';
import { isPremiumLinkType, hasPremiumAccess } from "../../../../lib/constants"; // Import feature gating helpers
import { GraphQLError } from 'graphql'; // For throwing specific GraphQL errors


interface ResolverContext {
  session: Session | null;
  // isAuthorized is no longer needed as we check context.session directly
}

export const Mutation = {
    createLink: async(_: any,
        params: { label?: string | null, content?: string | null, type: string},
        context: ResolverContext) => {
            // Ensure user and subscription_plan are present in the session
            if (!context.session?.user?.id || typeof context.session.user.subscription_plan === 'undefined') {
                throw new GraphQLError('Authentication required with subscription plan information.', {
                    extensions: { code: 'UNAUTHENTICATED' },
                });
            }

            const userPlan = context.session.user.subscription_plan;
            if (isPremiumLinkType(params.type) && !hasPremiumAccess(userPlan)) {
                throw new GraphQLError(
                    `Your current plan (${userPlan || 'unknown'}) does not allow creating "${params.type}" links. Please upgrade.`,
                    { extensions: { code: 'FORBIDDEN', feature: params.type } }
                );
            }

            const link = await Link.create(params, context.session.user.id);
            return link;
    },
    updateLinkById: async(_: any,
        params: { label?: string | null, content?: string | null, id: number, position: number, type: string},
        context: ResolverContext) => {
            if (!context.session?.user?.id || typeof context.session.user.subscription_plan === 'undefined') {
                 throw new GraphQLError('Authentication required with subscription plan information.', {
                    extensions: { code: 'UNAUTHENTICATED' },
                });
            }

            const userPlan = context.session.user.subscription_plan;
            if (isPremiumLinkType(params.type) && !hasPremiumAccess(userPlan)) {
                 throw new GraphQLError(
                    `Your current plan (${userPlan || 'unknown'}) does not allow updating to "${params.type}" link type. Please upgrade.`,
                    { extensions: { code: 'FORBIDDEN', feature: params.type } }
                );
            }
            // Optional: Check if the link *being updated* was already a premium type,
            // and if the user's plan has since downgraded. This is more complex.
            // For now, we only check if the *target* type is premium.

            const updatedLink = await Link.updateById(params, context.session.user.id);
            return updatedLink;
    },
    deleteLinkById: async(_: any,
        { id }: { id: number },
        context: ResolverContext) => {
            if (!context.session?.user?.id) throw new Error('Authentication required.');
            const link = await Link.deleteById(id, context.session.user.id);
            return link;
    },
    reorderLink: async(_: any,
        { id, newIndex, oldIndex }: { id: number, newIndex: number, oldIndex: number },
        context: ResolverContext) => {
            if (!context.session?.user?.id) throw new Error('Authentication required.');
            const links = await Link.reorder(id, newIndex, oldIndex, context.session.user.id);
            return links;
    },
    createEvent: async(_: any,
        { type, link_id, user_id_on_public_page }: { type: 'view' | 'click', link_id?: string, user_id_on_public_page?: string }, // user_id_on_public_page for events triggered on public user pages
        context: ResolverContext) => {

            let targetUserId = context.session?.user?.id;

            // If user_id_on_public_page is provided, this event is for a public page view/click.
            // The event should be associated with the owner of that public page.
            if (user_id_on_public_page) {
                targetUserId = user_id_on_public_page;
            }

            if (!targetUserId) {
                // This case should ideally not be reached if logic is sound elsewhere
                // (e.g. public pages always pass user_id_on_public_page, dashboard ensures session)
                throw new Error('User context for event creation is missing.');
            }

            const event = await Event.create(type, targetUserId, link_id);
            return event;
    }
};