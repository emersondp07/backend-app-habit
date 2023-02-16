import WebPush from 'web-push'
import { FastifyInstance } from 'fastify'
import { z } from 'zod';

const publicKey = 'BKE_1zuJ_LMPigXnZp-OG9GEFN7uUkM4_AQR2FSUJBBfE6cVNQoXM4Ls0hryvcYArfKatLSe2wZYNhExh-bIxsE';
const privateKey = 'H4lijtvCBZHufqAVqJIU_gUKWNw81EURrh-JPqF8cXs';

WebPush.setVapidDetails('http://localhost:3333', publicKey, privateKey)

export async function notificationRoutes(app: FastifyInstance) {
  app.get('/push/public_key', () => {
    return {
      publicKey,
    }
  })

  app.post('/push/register', (request, reply) => {
    console.log(request.body)

    return reply.status(201).send()
  })

  app.post('/push/send', async (request, reply) => {
    const sendPushBody = z.object({
      subscription: z.object({
        endpoint: z.string(),
        keys: z.object({
          p256dh: z.string(),
          auth: z.string()
        })
      })
    })

    const { subscription } = sendPushBody.parse(request.body)

    setTimeout(() => {
      WebPush.sendNotification(subscription, 'HELLO DO BACKEND')
    }, 5000)

    return reply.status(201).send()
  })
}
