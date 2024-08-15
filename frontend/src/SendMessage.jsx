import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { QrContext } from './qrContest/QrContest';

const SendMessage = ({ clientId }) => {
    const [number, setNumber] = useState();
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState('');

    const {qrCode} = useContext(QrContext);

    const [clientInitialized, setClientInitialized] = useState(true);

    useEffect(() => {
        const initializeClient = async () => {
            try {
                const res = await axios.post(`http://localhost:3000/initialize-client/${clientId}`);
                console.log(res);
                if (res.data.success) {
                    setClientInitialized(true);
                    console.log(res.data)
                } else {
                    setResponse('Failed to initialize client');
                }
            } catch (error) {
                setResponse('Failed to initialize client');
                // console.error('Error initializing client:', error);
            }
        };

        initializeClient();
    }, []);

  

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!clientInitialized) {
            setResponse('Client not initialized');
            return;
        }
        try {
            const res = await axios.post(`http://localhost:3000/send-message/${9262827242}`,{number,message});
            setResponse(res.data.message);
        } catch (error) {
            setResponse('Failed to send message');
            console.error('Error sending message:', error);
        }
    };

    return (
        <div>
            {/* {loading && <h1>Loading...</h1>} */}
            <h2>Send WhatsApp Message</h2>
            {!  qrCode ? 'Loading QR Code...' : 'Loaded'}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Number:
                        <input type="text" value={number} onChange={(e) => setNumber(e.target.value)} required />
                    </label>
                </div>
                <div>
                    <label>
                        Message:
                        <textarea value={message} onChange={(e) => setMessage(e.target.value)} required />
                    </label>
                </div>
                <button type="submit">Send</button>
            </form>
            {response && <p>{response}</p>}
        </div>
    );
};

export default SendMessage;