const express = require('express');
const app = express();

const helloRoutes = require('./src/routes/hello');
const usersRoutes = require('./src/routes/users');

const port = 3000;

// To support URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Built-in middleware
app.use(express.json());

app.use('/', helloRoutes);
app.use('/api/v1', usersRoutes);

// membuat default error response
app.use((error, req, res, next) => {
    // membuat status yang dinamis dengan default error status 500
    const status = error.errorStatus || 500;
    // membuat error message dinamis
    const message = error.message;
    // membuat error data yang dinamis
    const data = error.data;

    res.status(status).json({message, data});
});

app.listen(3000, () => {
    console.log(`Server listening at http://localhost:${port}`);
});