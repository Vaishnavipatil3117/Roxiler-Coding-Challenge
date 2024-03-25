const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

// Schema
const schemaData = mongoose.Schema({
    id: Number,
    title: String,
    price: Number,
    description: String,
    category: String,
    image: String,
    sold: Boolean,
    dateOfSale: Date
});

const userModel = mongoose.model("user", schemaData);

// GET endpoint to fetch data with search and pagination
app.get("/", async (req, res) => {
    try {
        const { search = '', page = 1, perPage = 10 } = req.query;

        // Define the aggregation pipeline stages
        const aggregationPipeline = [
            {
                $match: {
                    $or: [
                        { "title": { $regex: search, $options: 'i' } }, // Case-insensitive search in title
                        { "description": { $regex: search, $options: 'i' } }, // Case-insensitive search in description
                        { "price": { $regex: search, $options: 'i' } } // Case-insensitive search in price (converted to string)
                    ]
                }
            },
            {
                $skip: (page - 1) * perPage // Pagination: Skip documents based on page number and documents per page
            },
            {
                $limit: parseInt(perPage) // Pagination: Limit the number of documents per page
            }
        ];

        // Execute the aggregation pipeline and retrieve the transactions data
        const transactionsData = await userModel.aggregate(aggregationPipeline);

        res.json({ success: true, data: transactionsData });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ success: false, error: 'Error fetching data' });
    }
});

// POST endpoint to create data
app.post("/create", async (req, res) => {
    try {
        console.log(req.body);
        const data = new userModel(req.body);
        await data.save();
        res.send({ success: true, message: "Data saved" });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ success: false, error: 'Error saving data' });
    }
});

// API for statistics
app.get('/statistics/:month', async (req, res) => {
    try {
        // Get the month parameter from the request params
        const selectedMonth = req.params.month.toLowerCase();

        // Define a mapping of month names to their respective numbers
        const monthMap = {
            'january': 1,
            'february': 2,
            'march': 3,
            'april': 4,
            'may': 5,
            'june': 6,
            'july': 7,
            'august': 8,
            'september': 9,
            'october': 10,
            'november': 11,
            'december': 12
        };

        // Validate the month value
        if (!monthMap[selectedMonth]) {
            return res.status(400).json({ error: 'Invalid month value' });
        }

        // Use the mapped month number
        const search = monthMap[selectedMonth];

        // Fetch data from MongoDB
        const data = await userModel.find({});

        // Initialize variables for statistics
        let sales = 0,
            soldItems = 0,
            totalItems = 0;

        // Loop through each transaction and calculate statistics
        for (let i = 0; i < data.length; i++) {
            const originalDate = new Date(data[i].dateOfSale);
            console.log(originalDate);
            const sold = data[i].sold;
            const month = originalDate.getMonth() + 1; // Months are zero-indexed, so add 1

            // Check if the month matches the selected month
            if (sold && month === search) {
                sales += data[i].price;
                soldItems += 1;
            }
            if (sold==false && month === search) {
                totalItems += 1;
            }
                
            // Increment total items regardless of sale status
        }

        // Send the statistics as a response
        res.status(200).json({
            totalSaleAmount: sales,
            totalSoldItems: soldItems,
            totalUnsoldItems: totalItems
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Connect to MongoDB and start server
mongoose.connect("mongodb://127.0.0.1:27017/readoperation")
    .then(() => {
        console.log("Connected to DB");
        app.listen(PORT, () => console.log("Server is running"));
    })
    .catch((err) => console.log("Error connecting to DB:", err));
