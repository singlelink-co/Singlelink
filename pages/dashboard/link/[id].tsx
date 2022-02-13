import { useRouter } from 'next/router'
import { useState } from 'react'
import Dashboard from '../../../components/dashboard'
import { useFindLinkByIdQuery, useUpdateLinkByIdMutation } from '../../../hooks-generated'
import { Link } from '../../api/src/generated-types'

const LinkDetail = () => {
    const router = useRouter()
    const { id } = router.query
    const [label, setLabel] = useState<string>()
    const [content, setContent] = useState<string>()
    const [type, setType] = useState<string>()
    const [position, setPosition] = useState<number>()
    const [loading, setLoading] = useState<boolean>(true)
    
    const useFindLinkById = useFindLinkByIdQuery({
        variables: {
            id: Number.parseInt(id as string ?? '')
        },
        onCompleted: (data) => {
            if(!data.findLinkById?.id || !data.findLinkById?.type) throw Error('Singlelink: DB model invalid.')
            setLoading(false)
            setLabel(data.findLinkById.label ?? '')
            setContent(data.findLinkById.content ?? '')
            setType(data.findLinkById.type ?? 'vanilla')
            setPosition(data.findLinkById.position)
        }
    })

    const updateLinkById = useUpdateLinkByIdMutation({
        onCompleted: (data) => {
            setLoading(false)
        }
    })

    const attemptSave = async () => {
        if(!position || !type || !id) throw Error('Cannot save without position, type, or id.')
        updateLinkById[0]({
            variables: {
                label,
                content,
                position,
                type,
                id: Number.parseInt(id as string)
            }
        })
    }
    
    return (
        <Dashboard>
            <h1 className='h1'>Edit link</h1>
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
                        </select>
                    </div><div className='flex flex-col space-y-2 mb-6'>
                        <label className='font-semibold text-lg text-gray-800'>Content URL</label>
                        <input onChange={(e) => setContent(e.target.value)} value={content ?? ''} className='px-5 py-3 rounded-lg border border-gray-200 w-full bg-white focus:ring-4 focus:ring-opacity-50 focus:ring-indigo-600 outline-0 ring-offset-2 focus:border-gray-1' type='text' placeholder='e.g. https://instagram.com/neutroncreative' />
                    </div><div className='flex flex-col space-y-2 mb-8'>
                        <label className='font-semibold text-lg text-gray-800'>Position</label>
                        <input onChange={(e) => setPosition(Number.parseInt(e.target.value))} value={position} className='px-5 py-3 rounded-lg border border-gray-200 w-full bg-white focus:ring-4 focus:ring-opacity-50 focus:ring-indigo-600 outline-0 ring-offset-2 focus:border-gray-1' type='number' placeholder='e.g. 2' />
                    </div><button onClick={() => attemptSave()} className='px-8 py-4 bg-indigo-600 w-full text-white font-semibold rounded-xl hover:bg-indigo-700'>Save changes</button></>
            }
        </Dashboard>
    )
}

export default LinkDetail