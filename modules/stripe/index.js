import stripeLib from 'stripe'
import getApis from '../algolia/apis'
import { rejectHitBadRequest, sendJSON } from '../helpers'

export default function() {
  const algoliaConfig = this.options.privateRuntimeConfig.algolia
  const apis = getApis(algoliaConfig)
  const secretKey = this.options.privateRuntimeConfig.stripe.secretKey
  const stripe = stripeLib(secretKey)
  const cloudName = this.options.cloudinary.cloudName
  const rootUrl = this.options.rootUrl
  this.nuxt.hook('render:setupMiddleware', app => {
    app.use('/api/stripe/create-session', createSession)
  })

  async function createSession(req, res) {
    const body = req.body
    if (!body || !body.homeId || !body.start || !body.end || body.start > body.end) {
      return rejectHitBadRequest(res)
    }
    const home = (await apis.homes.get(body.homeId)).json
    const nights = (body.end - body.start) / 86400
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${rootUrl}/home/${body.homeId}?result=success`,
      cancel_url: `${rootUrl}/home/${body.homeId}`,
      line_items: [{
        quanity: 1,
        price_data: {
          currency: 'USD',
          unit_amount: home.pricePerNight * nights * 100,
          // unit amount is in cents, so we need to take the home's
          // price per night multiply by the number of nights, and then multiply it by 100
          product_data: {
            name: 'Reservation for ' + home.title,
            images: [`http://res.cloudinary.com/${cloudName}/image/upload/${home.images[0]}`]
          }
        },

      }]
    })

    sendJSON({ id: session.id }, res)
  }
}