import got from '../../../client/fetch'

export default async (req, reply) => {
  const { billingEmail, organizationId, billingToken, publicallyGive, description } = req.body
  try {
    const reqHeaders = {
      'x-requested-with': req.headers['x-requested-with'],
      cookie: req.headers.cookie
    }
    const response = await got.put('organization', {
      json: { billingEmail, organizationId, publicallyGive, description, billingToken },
      headers: reqHeaders
    })
    reply.status(response.statusCode).json(response.body)
  } catch (e) {
    console.error({ message: e.response.body, statusCode: e.response.statusCode })
    reply.status(e.response.statusCode || 500).send(e.response.body)
  }
}
