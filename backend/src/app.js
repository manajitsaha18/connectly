const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

const authRouter = require('./routes/auth.route');
const userRouter = require('./routes/user.route');
const chatRouter = require('./routes/chat.route');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/chat', chatRouter);

if (process.env.NODE_ENV === 'production') {

    const frontendPath = path.join(
        __dirname,
        '../../frontend/dist'
    );

    app.use(express.static(frontendPath));

    app.get('*', (req, res) => {
        res.sendFile(
            path.join(frontendPath, 'index.html')
        );
    });
}

module.exports = app;