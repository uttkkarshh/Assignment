// JavaScript source code
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const axios = require('axios'); // for making HTTP requests
const _ = require('lodash');

// Middleware to parse JSON request bodies
app.use(express.json());

function analys(blogData) {

    // Analytics using Lodash
    const totalBlogs = _.size(blogData); // Calculate the total number of blogs fetched

    const longestTitleBlog = _.maxBy(blogData, (blog) => blog.title.length); // Find the blog with the longest title

    const privacyBlogs = _.filter(blogData, (blog) => _.includes(blog.title.toLowerCase(), 'privacy')); // Determine blogs with titles containing the word "privacy"
const privacyBlogsNumber = privacyBlogs.length ;
    const uniqueTitles = _.uniqBy(blogData, 'title'); // Create an array of unique blog titles

        return {
        message: 'Blog statistics analyzed successfully',
            totalBlogs,
            longestTitleBlog,
            privacyBlogsNumber,
            uniqueTitles
    }
}

const AnalysMemo = _.memoize(analys);

// Define your API route for blog statistics
app.get('/api/blog-stats', async (req, res) => {
    try {
        // Make the HTTP request to the third-party blog API
        const response = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs', {
            headers: {
                'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6'
            }
        });
      
        // Extract the data from the response
        const Data = response.data.blogs;
        const rs=AnalysMemo(Data);
        
        res.status(200).json(rs);
    } catch (error) {
        // Handle errors
        console.error('Error fetching and analyzing blog data:', error);
        let errorMessage = 'An error occurred while fetching and analyzing blog data';

        // Check the error response status and provide an appropriate error message
        if (error.response && error.response.status) {
            errorMessage = `HTTP Error: ${error.response.status}`;
        }

        res.status(500).json({ error: errorMessage });
    }
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
