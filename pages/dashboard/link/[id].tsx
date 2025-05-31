import Head from 'next/head';
import Link from 'next/link'; // Import Link for the upgrade message
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Dashboard from '../../../components/dashboard';
import { useDeleteLinkByIdMutation, useFindLinkByIdQuery, useUpdateLinkByIdMutation } from '../../../hooks-generated';
import { isPremiumLinkType, hasPremiumAccess } from '../../../lib/constants'; // Import helpers

const LinkDetail = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { id } = router.query;
    const [label, setLabel] = useState<string | undefined>();
    const [content, setContent] = useState<string | undefined>();
    const [type, setType] = useState<string | undefined>();
    const [originalType, setOriginalType] = useState<string | undefined>(); // To track initial type
    const [position, setPosition] = useState<number | undefined>();
    const [loading, setLoading] = useState<boolean>(true);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const userSubscriptionPlan = session?.user?.subscription_plan;
    const canUsePremium = hasPremiumAccess(userSubscriptionPlan);
    const selectedTypeIsPremium = type ? isPremiumLinkType(type) : false;
    const shouldBlockSave = selectedTypeIsPremium && !canUsePremium;

    useEffect(() => {
        if (status === 'loading') return;
        if (!session) router.push('/auth/login');
    }, [session, status, router]);

    const findLinkQuery = useFindLinkByIdQuery({
        variables: { id: Number.parseInt(id as string ?? '') },
        skip: !id || !session,
        onCompleted: (data) => {
            if(!data.findLinkById?.id || !data.findLinkById?.type) {
                console.error('LaunchLinks: DB model invalid or link not found.');
                setLoading(false);
                setErrorMessage("Link not found or you're not authorized to view it.");
                return;
            }
            setLoading(false);
            setLabel(data.findLinkById.label ?? '');
            setContent(data.findLinkById.content ?? '');
            setType(data.findLinkById.type ?? 'vanilla');
            setOriginalType(data.findLinkById.type ?? 'vanilla'); // Store original type
            setPosition(data.findLinkById.position);
            // Initial check for premium type when data loads
            if (isPremiumLinkType(data.findLinkById.type) && !canUsePremium) {
                 setErrorMessage(`Warning: This is a premium "${data.findLinkById.type}" link. Your current plan does not support this. Saving changes might be restricted if you change type to another premium one or if backend enforces this strictly on any update.`);
            }
        },
        onError: (error) => {
            console.error("Error fetching link:", error);
            setLoading(false);
            setErrorMessage("Error fetching link details.");
        }
    });

    const updateLinkMutation = useUpdateLinkByIdMutation({
        onCompleted: (data) => {
            setIsSaving(false);
            setOriginalType(type); // Update original type on successful save
            setErrorMessage(null); // Clear error on success
            const iframe = document.getElementById('launchlinks-preview') as HTMLIFrameElement;
            if (iframe) iframe.src = iframe.src;
        },
        onError: (error) => {
            setIsSaving(false);
            setErrorMessage(error.message || "Error updating link. Please try again.");
            console.error("Error updating link:", error);
        }
    });

    const deleteLinkMutation = useDeleteLinkByIdMutation({
        onCompleted: (data) => {
            setIsSaving(false);
            router.push('/dashboard/');
        },
        onError: (error) => {
            setIsSaving(false);
            setErrorMessage(error.message || "Error deleting link. Please try again.");
            console.error("Error deleting link:", error);
        }
    });

    const handleTypeChange = (newType: string) => {
        setType(newType);
        if (isPremiumLinkType(newType) && !canUsePremium) {
            setErrorMessage(`The "${newType}" link type is a premium feature. Please upgrade your plan to save this change.`);
        } else {
            setErrorMessage(null);
        }
    };

    const attemptSave = async () => {
        if(position === undefined || position < 0 || !type || !id) {
            setErrorMessage('Cannot save without position, type, or id.');
            return;
        }
        if (shouldBlockSave) {
             setErrorMessage(`Your current plan does not allow saving the "${type}" link type. Please upgrade or choose a different link type.`);
            return;
        }
        setErrorMessage(null);
        setIsSaving(true);
        updateLinkMutation[0]({
            variables: { label, content, position, type, id: Number.parseInt(id as string) }
        });
    };

    const attemptDelete = async () => {
        setErrorMessage(null);
        setIsSaving(true);
        deleteLinkMutation[0]({ variables: { id: Number.parseInt(id as string) } });
    };

    if (status === 'loading' || loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }
    if (!session) {
        return <div className="flex justify-center items-center min-h-screen">Redirecting to login...</div>;
    }
    if (findLinkQuery.error && !findLinkQuery.data?.findLinkById) { // Check if data is also missing
        return <div className="flex justify-center items-center min-h-screen text-red-500">Error loading link data. It might have been deleted or you do not have permission.</div>;
    }

    return (
        <Dashboard>
            <Head>
                <title>Edit link | LaunchLinks</title>
            </Head>
            <h1 className='h1'>Edit link</h1>

            {errorMessage && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                    {errorMessage}
                    {errorMessage.includes("Please upgrade") && (
                         <Link href="/pricing">
                            <a className="ml-2 font-semibold underline hover:text-red-800">Upgrade Now</a>
                        </Link>
                    )}
                </div>
            )}

            {!loading && findLinkQuery.data?.findLinkById ? (
            <>
                <div className='flex flex-col space-y-2 mb-6'>
                    <label className='font-semibold text-lg text-gray-800'>Label</label>
                    <input onChange={(e) => setLabel(e.target.value)} value={label ?? ''} disabled={isSaving} className='px-5 py-3 rounded-lg border border-gray-200 w-full bg-white focus:ring-4 focus:ring-opacity-50 focus:ring-indigo-600 outline-0 ring-offset-2 focus:border-gray-1 disabled:opacity-50' type='text' placeholder='e.g. My Instagram profile' />
                </div>
                <div className='flex flex-col space-y-2 mb-6'>
                    <label className='font-semibold text-lg text-gray-800'>Type</label>
                    <select
                        onChange={(e) => handleTypeChange(e.target.value)}
                        value={type}
                        disabled={isSaving}
                        className='px-5 py-3 rounded-lg border border-gray-200 w-full bg-white focus:ring-4 focus:ring-opacity-50 focus:ring-indigo-600 outline-0 ring-offset-2 focus:border-gray-1 disabled:opacity-50'
                    >
                        <option value="vanilla">Vanilla Link</option>
                        <option value="text">Text Block</option>
                        <option value="avatar">Avatar</option>
                        <option value="image">Image {isPremiumLinkType('image') && !canUsePremium ? '🔒 Pro' : ''}</option>
                        <option value="youtube">Youtube Video {isPremiumLinkType('youtube') && !canUsePremium ? '🔒 Pro' : ''}</option>
                        <option value="html">HTML Embed {isPremiumLinkType('html') && !canUsePremium ? '🔒 Pro' : ''}</option>
                    </select>
                </div>
                <div className='flex flex-col space-y-2 mb-6'>
                    <label className='font-semibold text-lg text-gray-800'>Content URL / Text</label>
                    <input onChange={(e) => setContent(e.target.value)} value={content ?? ''} disabled={isSaving} className='px-5 py-3 rounded-lg border border-gray-200 w-full bg-white focus:ring-4 focus:ring-opacity-50 focus:ring-indigo-600 outline-0 ring-offset-2 focus:border-gray-1 disabled:opacity-50' type='text' placeholder='e.g. https://instagram.com/yourprofile or your custom text' />
                </div>
                <button onClick={attemptSave} disabled={isSaving || shouldBlockSave} className='px-8 py-4 bg-indigo-600 w-full text-white font-semibold rounded-xl hover:bg-indigo-700 mb-4 disabled:opacity-50'>
                    {isSaving ? 'Saving...' : 'Save changes'}
                </button>
                <button onClick={attemptDelete} disabled={isSaving} className='px-8 py-4 bg-red-100 w-full text-red-600 border border-red-600 font-semibold rounded-xl hover:bg-red-600 hover:text-white disabled:opacity-50'>
                    {isSaving ? 'Deleting...' : 'Delete link'}
                </button>
            </>
            ) : (
                 <div className='p-3 text-gray-600'>Could not load link details. It may have been deleted or an error occurred.</div>
            )}
        </Dashboard>
    );
};

export default LinkDetail;