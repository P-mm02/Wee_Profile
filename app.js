const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (including the HTML file)
app.use(express.static('public'));

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});


// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Validate username and password (replace this with your authentication logic)
    if (username === 'user' && password === 'password') {
        // Redirect to dashboard or success page
        res.redirect('/dashboard');
    } else {
        // Redirect back to login page with error message
        res.redirect('/login?error=1');
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
