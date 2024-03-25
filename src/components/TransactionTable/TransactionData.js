import React, { useState, useEffect } from 'react';
import TransactionsStatistics from "../TransactionsStatistics/TransactionsStatistics";
import './TransactionData.css'
import axios from "axios";
import TransactionsBarChart from '../TransactionsBarChart/TransactionsBarChart';

const TransactionData = () => {
    const [dataList, setDataList] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('March'); // Default to March
    const [searchInput, setSearchInput] = useState('');
    const [page, setPage] = useState(1);

    axios.defaults.baseURL = "http://localhost:8080/";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("/");
                console.log(response.data);
                if (response.data.success) {
                    setDataList(response.data.data);
                    alert(response.data.message);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [page, searchInput, selectedMonth]);

    // Array of month names
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    return (
        <>
            <div className='main-container'>
                <div className='first-container'>
                    <h3 width="20px">Transaction Dashboard</h3>
                </div>
                <div className='second-container'>
                    <input value={searchInput} onChange={(e)=> setSearchInput(e.target.value)} className='input-element' type="search" placeholder='Search transaction' />
                    <select  value={selectedMonth} onChange={(e)=> setSelectedMonth(e.target.value)} className='dropdown-list'>
                        {months.map((month, index) => (
                            <option className='selector-element' key={index} value={month}>{month}</option>
                        ))}
                    </select>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th>Date Of Sale</th>
                            <th>Image</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataList.map((o) => {
                            const { category, description, id, image, price, dateOfSale, title } = o;
                            return (
                                <tr key={id}>
                                    <td>{id}</td>
                                    <td>{title}</td>
                                    <td>{description}</td>
                                    <td>{price}</td>
                                    <td>{category}</td>
                                    <td>{dateOfSale}</td>
                                    <td><img height={'100px'} className='product-image' src={image} alt="" /></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <div className='last-container'>
                    <p>Page No: {page}</p>
                    <p><span onClick={()=> setPage(prevValue=> prevValue+1)} className='next-button'>Next</span> - <span onClick={()=> setPage(prevValue=> prevValue>1? prevValue-1: prevValue)} className='previous-button'>Previous</span></p>
                    <p>Per Page: 10</p>
                </div>
                <div className='statistics-container'>
                    {/* {transactions component} */}
                </div>
                <div className='line'>
                    <hr  />
                </div>
            </div>
            <TransactionsStatistics selectedMonth={selectedMonth} />
            <TransactionsBarChart  selectedMonth={selectedMonth} />
        </>
    );
};

export default TransactionData;
