import { useState } from 'react';

export const useReceiptScanner = (apiClient) => {
    const [isScanning, setIsScanning] = useState(false);

    const scanReceipt = async (file, onScanSuccess) => {
        if (!file) return;

        setIsScanning(true);
        const formData = new FormData();
        formData.append('receipt', file);

        try {
            const res = await apiClient.post('/receipts/scan', formData);
            // Call the success callback with the extracted data
            onScanSuccess(res.data);
        } catch (error) {
            console.error("Receipt scan failed", error);
            alert("Sorry, we couldn't read the receipt.");
        } finally {
            setIsScanning(false);
        }
    };

    return { isScanning, scanReceipt };
};