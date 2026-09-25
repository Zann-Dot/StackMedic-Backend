import express from 'express'
import { Webhook } from 'svix'
import { clerkClient } from '@clerk/express'

const router = express.Router()

router.post(
    '/api/webhooks/register',
    express.raw({ type: 'application/json' }),
    async (req, res) => {
        const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

        if (!WEBHOOK_SECRET) {
            return res.status(500).json({ error: 'Missing webhook secret' })
        }

        const svix_id = req.headers['svix-id']
        const svix_timestamp = req.headers['svix-timestamp']
        const svix_signature = req.headers['svix-signature']

        if (!svix_id || !svix_timestamp || !svix_signature) {
            return res.status(400).json({ error: 'Missing svix headers' })
        }

        const payload = req.body
        const wh = new Webhook(WEBHOOK_SECRET)
        let evt

        try {
            evt = wh.verify(payload, {
                "svix-id": svix_id,
                "svix-signature": svix_signature,
                "svix-timestamp": svix_timestamp
            })
        } catch (err) {
            console.error('Error verifying webhook:', err)
            return res.status(400).json({ error: 'Invalid webhook signature' })
        }

        const eventType = evt.type

        if (eventType === 'user.created') {
            const { id: userId } = evt.data

            try {
                await clerkClient.users.updateUserMetadata(userId, {
                    publicMetadata: {
                        role: 'developer',
                    },
                })

                console.log(`Default role assigned to user ${userId}`)
            } catch (error) {
                console.error(`Failed to assign default role to user ${userId}:`, error)
                return res.status(500).json({ error: 'Failed to update user metadata' })
            }
        }

        return res.status(200).json({ success: true })
    }
)

export default router