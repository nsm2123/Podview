const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// Use CORS middleware
app.use(cors());
app.use(bodyParser.json());

// Client ID and Secret
const clientId = '11c5ad1fd49e42e5a13a18ab3be7e427';
const clientSecret = '337d40d56a984fe1a0c43b7b089ba2e4';

// Route to get access token
app.get('/api/token', async (req, res) => {
    try {
        const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: clientId,
            client_secret: clientSecret
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const accessToken = tokenResponse.data.access_token;
        res.json({ access_token: accessToken });
    } catch (error) {
        console.error('Error getting access token:', error.message);
        res.status(500).json({ error: 'Error getting access token' });
    }
});

// Start server
app.listen(8888, () => {
    console.log('Server is running on http://127.0.0.1:8888');
});
