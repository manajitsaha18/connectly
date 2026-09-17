const {StreamChat} = require('stream-chat');

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
    console.error('STREAM_API_KEY and STREAM_API_SECRET missing in environment variables');

}

const streamClient = new StreamChat.getInstance(apiKey, apiSecret);

async function upsertStreamUser(userData) {
    try {
        await streamClient.upsertUsers([userData]);
        return userData;
    } catch (error) {
        console.error('Error upserting Stream user:', error);
    }
}


function generateStreamToken(userId) {
    try {
        const userIdstr = userId.toString();
        const token = streamClient.createToken(userIdstr);
        return token;
    } catch (error) {
        console.error('Error generating Stream token:', error);
    }
}

module.exports = {upsertStreamUser, generateStreamToken};