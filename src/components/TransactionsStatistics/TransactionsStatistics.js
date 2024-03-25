import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TransactionStatistics.css';


const TransactionsStatistics = ({ selectedMonth }) => {
    const [statistics, setStatistics] = useState(null);

    useEffect(() => {
        const fetchStatistics = async () => {
            if (selectedMonth !== undefined) {
                try {
                    const response = await axios.get(`http://localhost:8080/statistics/${selectedMonth}`);
                    console.log('Response:', response.data);
                    setStatistics(response.data);
                } catch (error) {
                    console.error('Error fetching transaction statistics:', error);
                }
            }
        };
    
        fetchStatistics();
    }, [selectedMonth]);

    console.log('Statistics:', statistics);

    return (
        <div>
            <h2>Transaction Statistics for {selectedMonth}</h2>
            {statistics ? (
                <div>
                    <div>Total Sale Amount: ${statistics.totalSaleAmount}</div>
                    <div>Total Sold Items: {statistics.totalSoldItems}</div>
                    <div>Total Not Sold Items: {statistics.totalUnsoldItems}</div>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default TransactionsStatistics;
