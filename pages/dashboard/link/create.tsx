import Head from 'next/head';
import Link from 'next/link'; // Import Link for the upgrade message
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Dashboard from '../../../components/dashboard';
import { useCreateLinkMutation } from '../../../hooks-generated';
import { isPremiumLinkType, hasPremiumAccess } from '../../../lib/constants'; // Import helpers

const CreateLinkPage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [label, setLabel] = useState<string | undefined>('');
    const [content, setContent] = useState<string | undefined>('');
    const [type, setType] = useState<string>('vanilla');
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const userSubscriptionPlan = session?.user?.subscription_plan;
    const canUsePremium = hasPremiumAccess(userSubscriptionPlan);
    const selectedTypeIsPremium = isPremiumLinkType(type);
    const shouldBlockCreation = selectedTypeIsPremium && !canUsePremium;

    // Effect to handle redirection if not authenticated
    useEffect(() => {
        if (status === 'loading') return;
        if (!session) router.push('/auth/login');
    }, [session, status, router]);

    const createLinkMutation = useCreateLinkMutation({
        onCompleted: (data) => {
            setIsCreating(false);
            router.push('/dashboard/');
        },
        onError: (error) => {
            setIsCreating(false);
            setErrorMessage(error.message || "Error creating link. Please try again.");
            console.error("Error creating link:", error);
        }
    });

    const handleTypeChange = (newType: string) => {
        setType(newType);
        if (isPremiumLinkType(newType) && !canUsePremium) {
            setErrorMessage(`The "${newType}" link type is a premium feature. Please upgrade your plan.`);
        } else {
            setErrorMessage(null);
        }
    };

    const handleCreate = async () => {
        if (!type) {
            setErrorMessage("Type is required to create a link.");
            return;
        }
        if (shouldBlockCreation) {
            setErrorMessage(`Your current plan does not allow creating "${type}" links. Please upgrade.`);
            return;
        }

        setErrorMessage(null); // Clear previous errors
        setIsCreating(true);
        createLinkMutation[0]({
            variables: {
                label,
                content,
                type: type ?? 'vanilla'
            }
        });
    };

    if (status === 'loading') {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }
    if (!session) {
        return <div className="flex justify-center items-center min-h-screen">Redirecting to login...</div>;
    }

    return (
        <Dashboard>
            <Head>
                <title>Create link | LaunchLinks</title>
            </Head>
            <h1 className='h1'>Create new link</h1>

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

            {isCreating ? (
                <div className='p-3 text-gray-600'>Creating link, please wait...</div>
            ) : (
            <>
                <div className='flex flex-col space-y-2 mb-6'>
                    <label htmlFor="linkLabel" className='font-semibold text-lg text-gray-800'>Label</label>
                    <input
                        id="linkLabel"
                        onChange={(e) => setLabel(e.target.value)}
                        value={label ?? ''}
                        className='px-5 py-3 rounded-lg border border-gray-200 w-full bg-white focus:ring-4 focus:ring-opacity-50 focus:ring-indigo-600 outline-0 ring-offset-2 focus:border-gray-1'
                        type='text'
                        placeholder='e.g. My Instagram profile'
                        disabled={isCreating}
                    />
                </div>
                <div className='flex flex-col space-y-2 mb-6'>
                    <label htmlFor="linkType" className='font-semibold text-lg text-gray-800'>Type</label>
                    <select
                        id="linkType"
                        onChange={(e) => handleTypeChange(e.target.value)}
                        value={type}
                        className='px-5 py-3 rounded-lg border border-gray-200 w-full bg-white focus:ring-4 focus:ring-opacity-50 focus:ring-indigo-600 outline-0 ring-offset-2 focus:border-gray-1'
                        disabled={isCreating}
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
                    <label htmlFor="linkContent" className='font-semibold text-lg text-gray-800'>Content URL / Text</label>
                    <input
                        id="linkContent"
                        onChange={(e) => setContent(e.target.value)}
                        value={content ?? ''}
                        className='px-5 py-3 rounded-lg border border-gray-200 w-full bg-white focus:ring-4 focus:ring-opacity-50 focus:ring-indigo-600 outline-0 ring-offset-2 focus:border-gray-1'
                        type='text'
                        placeholder='e.g. https://instagram.com/yourprofile or your custom text'
                        disabled={isCreating}
                    />
                </div>
                <button
                    onClick={handleCreate}
                    className='px-8 py-4 bg-indigo-600 w-full text-white font-semibold rounded-xl hover:bg-indigo-700 mb-4 disabled:opacity-50'
                    disabled={isCreating || shouldBlockCreation}
                >
                    {isCreating ? 'Creating...' : 'Create link'}
                </button>
            </>
            )}
        </Dashboard>
    );
};

export default CreateLinkPage;