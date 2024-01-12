import express from "express";
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const database = {
    users: [
        {
            id: "123",
            name: "john",
            email: "john@gmail.com",
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: "124",
            name: "fmsarp",
            email: "fmsarp@gmail.com",
            password: 'herb420',
            entries: 0,
            joined: new Date()
        },
    ],
    login: [
        {
            id: '123',
            hash: '',
            email: 'john@gmail.com'
        }
    ]
};

app.get("/", (req, res) => {
    res.send(database.users);
});

app.post("/signin", (req, res) => {
    // Load hash from your password DB.
    bcrypt.compare("apples", '$2a$10$8GvpgjoGyLfAc9YaT9eC3eXNmSqPoAYWytlUo92Oou5fwoZzbbekS', function (err, res) {
        // res == true
        console.log('first guess', res)
    });

    if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
        res.json(database.users[0]);
    } else {
        res.status(400).json('error logging in');
    }
});

app.post('/register', (req, res) => {
    const { email, name } = req.body;

    database.users.push(
        {
            id: "125",
            name: name,
            email: email,
            entries: 0,
            joined: new Date()
        }
    )
    res.json(database.users[database.users.length - 1]);
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            res.json(user);
        }
    })
    if (!found) {
        res.status(404).json('not found');
    }
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++;
            res.json(user.entries);
        }
    })
    if (!found) {
        res.status(404).json('not found');
    }
})


app.listen(3000, () => {
    console.log("app is running on port 3000");
});

/*
/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT  --> user

*/
