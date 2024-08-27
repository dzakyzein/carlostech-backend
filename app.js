const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const cookieParse = require('cookie-parser');
const path = require('path');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

//router
const ToolsRouter = require('./routes/ToolsRouter');
const UsersRouter = require('./routes/users');
const AuthRouter = require('./routes/AuthRouter');
const ReservationRouter = require('./routes/ReservationRouter');

dotenv.config();

//middleware
app.use(express.json());
app.use(cookieParse());

app.use(morgan('dev'));
app.use(cors());

// Menyajikan file statis dari folder 'uploads'
app.use('/uploads', express.static('uploads'));

//routing
app.use('/api/v1/users', UsersRouter);
app.use('/api/v1/auth', AuthRouter);
app.use('/api/v1/tools', ToolsRouter);
app.use('/api/v1/reservations', ReservationRouter);

app.use(notFound);
app.use(errorHandler);

//server
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`server berjalan di ${port}`);
});
