import Link from "../../../lib/models/Link"
import Event from "../../../lib/models/Event"

const handler = async (req, res) => {
    const { id } = req.query
    if(!id) throw Error('Link ID needed to redirect')
    const link = await Link.findById(id)
    if(!link) throw Error(`Could not find Link with id ${id}`)
    const event = await Event.create('click', id)
    return res.redirect(link.content)
}

export default handler