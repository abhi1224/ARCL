import app from './app.js';
import { connectDB } from './config/db.js';

connectDB()
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running at port ${process.env.PORT}`);    
    })
})
.catch((error) => {
    console.log(`Database connection failed !`);    
})


app.get('/', (req, res) => {
    res.end('Hello from server')
})