// Import the MailSlurp client
import { MailSlurp } from 'mailslurp-client';
import { NextApiRequest, NextApiResponse } from 'next';


// Initialize the MailSlurp client with your API key
const mailslurp = new MailSlurp({ apiKey: process.env.MAILSLURP_API_KEY ? process.env.MAILSLURP_API_KEY : '' });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { firstName, duration } = req.body;

            // Calculate expiration time based on selected duration
            const expiration: number = {
                '10min': 10 * 60 * 1000,
                '1hr': 60 * 60 * 1000,
                '1day': 24 * 60 * 60 * 1000,
                '1week': 7 * 24 * 60 * 60 * 1000,
            }[duration];

            if (!expiration) {
                return res.status(400).json({ error: 'Invalid duration selected' });
            }

            // Create a new inbox with an expiration time
            const inbox = await mailslurp.createInbox({ expiresIn: expiration });

            // Respond with the inbox details
            res.status(200).json({
                message: 'Email created successfully',
                firstName,
                email: inbox.emailAddress,
                expiresIn: duration,
            });
        } catch (error) {
            console.error('Error creating email', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
