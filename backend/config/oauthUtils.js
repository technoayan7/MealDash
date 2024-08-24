import { OAuth2Client } from 'google-auth-library';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET);

export const verifyGoogleToken = async (tokenId) => {
    try {
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const userId = payload['sub'];
        return { userId, email: payload['email'], name: payload['name'] };
    } catch (error) {
        throw new Error('Error verifying Google token');
    }
};
