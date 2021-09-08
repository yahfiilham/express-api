const { v4: uuidv4 } = require('uuid'); // third-party-module -> membuat id random
const { validationResult } = require("express-validator");
const jwt = require('jsonwebtoken'); // third-party-module -> token random

let data = [
    {
        "id": 1,
        "username": "yahfi",
        "email": "yahfi.ilham@gmil.com",
        "nohp": "089517819502",
        "password": "admin123"
    },
    {
        "id": 2,
        "username": "evan",
        "email": "evan@gmail.com",
        "nohp": "089517819854",
        "password": "admin123"
    }
];

// READ all data 
exports.readDataUsers = (req, res) => {
    
    jwt.verify(req.token, 'secret', (err, authData) => {
        if (err) {
            res.status(403).json({
                status: 403,
            message: "upss, you are not allowed to access this API. Enter the token first, try login in to get access rights/token.",
            });
        } else if (data.length == 0) {
            res.status(400).json({
                status: 400,
                message: "Blank Data!, you have to enter your data",
                data: null
            });
        }  else {
            res.status(200).json({
                status: 200,
                message: 'Get users data, success',
                authData,
            });
        }
    });

};

// READ data by id
exports.readDataUser = (req, res) => {
    id = req.params.id;
    const found = data.find((i) => i.id == id);

    if (found) {
        res.status(200).json({
            status: 200,
            message: 'Get detail user data, success!',
            data : found,
        });
    } else {
        res.status(404).json({
            status: 404,
            message: `Data with the id ${id} not found!`,
            data: null
        });
    }
};


// Creat data baru
exports.creatDataUsers = (req, res) => {
    // menghandle request body
    const {username, email, nohp, password} = req.body;

    // validasi input user
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new Error('Invalid Input Value!');
        err.errorStatus = 400;
        err.data = errors.array();
        throw err;
    }

    // menangkap id secara otomatis dengan mudule uuid
    const id = uuidv4();
    // menangkap request body
    const user = {id, username, email, nohp, password};

    // simpan ke data array
    data.push(user);

    res.status(201).json({
        status: 201,
        message: `User with the username ${user.username} added to the database`,
        data: user,
    });
};


// update data -> berdasarkan id
exports.updateDataUsers = (req, res) => {
    // validasi input user
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new Error('Invalid Input Value!');
        err.errorStatus = 400;
        err.data = errors.array();
        throw err;
    }

    // menghandle request body
    const {username, email, nohp, password} = req.body;

    // menangkap id
    id = req.params.id;
    const user = data.find((i) => i.id == id);

    if (username) user.username = username;
    if (email) user.email = email;
    if (nohp) user.nohp = nohp;
    if (password) user.password = password;

    res.status(200).json({
        status: 200,
        message: `User with the username ${user.username} has been updated`,
        data: user,
    });
};


// delete data user
exports.deleteDataUsers = (req, res) => {

    id = req.params.id;
    users = data;

    // errorr ketika id tidak ada di data
    newData = users.filter((user) => user.id != id);
    if (users.length == newData.length) {
        res.status(404).json({
            status: 404,
            message: `Data with the id ${id} not found!`,
            data: null
        })
        return false;
    }
    
    // new data
    data = data.filter((user) => user.id != id);
    res.status(200).json({
        status: 200,
        message: `User with the id ${id} deleted from the database.`,
        data,
    });
};

// POST data user login 
// generate jwt
exports.createUserLogin = (req, res) => {
    const { username, password } = req.body;

    jwt.sign({ data }, 'secret', { expiresIn: '60s' }, (err, token) => {
        data.map((i) => {
            // jika username dan password sama kirim token
            if (i.username == username && i.password == password) {
                res.status(201).json({
                    status: 201,
                    message: 'login succesfull',
                    token,
                });
            } 

            res.status(400).json({
                status: 400,
                message: 'invalid username or password',
                token: null,
            });
        });
    });
};

// membuat fungsi verifikasi token
exports.verifyToken = (req, res, next) => {
    // mengambil header 
    const bearerHeader = req.headers.authorization;
    if (typeof bearerHeader !== 'undefined' ) {
        // split header dengan method split
        const bearer = bearerHeader.split(' ');
        // menampung token
        const bearerToken = bearer[1];
        // set token
        req.token = bearerToken;
        // middleware next
        next();

    } else {
        // kirim forbidden
        res.status(403).json({
            status: 403,
            message: "upss, you are not allowed to access this API. Enter the token first, try login in to get access rights/token.",
        });
    }
};
