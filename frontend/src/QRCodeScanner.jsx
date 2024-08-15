import React, { useState, useEffect , useContext} from 'react';
import axios from 'axios';
import { QrContext } from './qrContest/QrContest';

const QRCodeScanner = ({ clientId }) => {
    // State to hold the QR code data URL and the status message
    const {qrCode , setQrCode}  = useContext(QrContext)

    const [message, setMessage] = useState('Loading QR Code...');

    useEffect(() => {
        const fetchQrCode = async () => {
            try {
                // Fetch the QR code for a specific client using the clientId prop
                const response = await axios.get(`http://localhost:3000/qr/${clientId}`);
                
                // Set the QR code data URL and the message from the response
                setQrCode(response.data.qrCode);
                // console.log(response)
                
            } catch (error) {
                console.log(error)
                // Handle any errors that occur during the API request
                setMessage('Failed to load QR code. Please try again.');
                console.error('Error fetching QR code:', error);
            }
        };

        // Trigger the QR code fetch when the component mounts
        fetchQrCode();
    }, [qrCode]); // Ensure the effect runs when clientId changes

    return (
        <div>
            {/* Display the message, and show the QR code if available */}
            
            {qrCode ? <img src={qrCode} alt="QR Code" /> : <p>QR code not yet available.</p>}
        </div>
    );
};

// Export the component so it can be used elsewhere in your app
export default QRCodeScanner;