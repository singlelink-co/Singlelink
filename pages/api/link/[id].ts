import Link from "../../../lib/models/Link"
import Event from "../../../lib/models/Event"
import { Maybe } from "../../../hooks-generated"

const handler = async (req: { query: { id: any } }, res: { redirect: (arg0: Maybe<string> | undefined) => any }) => {
    const { id } = req.query
    if(!id) throw Error('Link ID needed to redirect')
    const link = await Link.findById(id)
    if(!link) throw Error(`Could not find Link with id ${id}`)
    const event = await Event.create('click', id)
    return res.redirect(link.content)
}

export default handler