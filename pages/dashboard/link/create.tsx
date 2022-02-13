import { useRouter } from 'next/router'
import { useState } from 'react'
import Dashboard from '../../../components/dashboard'
import { useCreateLinkMutation } from '../../../hooks-generated'

const LinkDetail = () => {
    const router = useRouter()
    const [label, setLabel] = useState<string>()
    const [content, setContent] = useState<string>()
    const [type, setType] = useState<string>()
    const [loading, setLoading] = useState<boolean>(false)

    const createLink = useCreateLinkMutation({
        onCompleted: (data) => {
            router.push('/dashboard/')
        }
    })  

    const create = async () => {
        setLoading(true)
        createLink[0]({
            variables: {
                label,
                content,
                type: type ?? 'vanilla'
            }
        })
    }

    return (
        <Dashboard>
            <h1 className='h1'>Create new link</h1>
            {!loading &&
            <><div className='flex flex-col space-y-2 mb-6'>
                    <label className='font-semibold text-lg text-gray-800'>Label</label>
                    <input onChange={(e) => setLabel(e.target.value)} value={label ?? ''} className='px-5 py-3 rounded-lg border border-gray-200 w-full bg-white focus:ring-4 focus:ring-opacity-50 focus:ring-indigo-600 outline-0 ring-offset-2 focus:border-gray-1' type='text' placeholder='e.g. My Instagram profile' />
                </div><div className='flex flex-col space-y-2 mb-6'>
                        <label className='font-semibold text-lg text-gray-800'>Type</label>
                        <select onChange={(e) => setType(e.target.value)} value={type} className='px-5 py-3 rounded-lg border border-gray-200 w-full bg-white focus:ring-4 focus:ring-opacity-50 focus:ring-indigo-600 outline-0 ring-offset-2 focus:border-gray-1'>
                            <option value="vanilla">Vanilla</option>
                            <option value="image">Image</option>
                            <option value="youtube">Youtube</option>
                            <option value="text">Text</option>
                            <option value="avatar">Avatar</option>
                            <option value="html">HTML/Code embed</option>
                        </select>
                    </div><div className='flex flex-col space-y-2 mb-6'>
                        <label className='font-semibold text-lg text-gray-800'>Content URL</label>
                        <input onChange={(e) => setContent(e.target.value)} value={content ?? ''} className='px-5 py-3 rounded-lg border border-gray-200 w-full bg-white focus:ring-4 focus:ring-opacity-50 focus:ring-indigo-600 outline-0 ring-offset-2 focus:border-gray-1' type='text' placeholder='e.g. https://instagram.com/neutroncreative' />
                    </div>
                    <button onClick={() => create()} className='px-8 py-4 bg-indigo-600 w-full text-white font-semibold rounded-xl hover:bg-indigo-700 mb-4'>Create link</button>
                    </>
            }
        </Dashboard>
    )
}

export default LinkDetail