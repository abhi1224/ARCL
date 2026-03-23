import e from 'express';
import app from './app.js';
import { connectDB } from './config/db.js';
import categoryRoutes from './routes/categoryRoutes.js'
import equipmentTypeRoutes from './routes/equipmentTypeRoutes.js'

app.use('/api/categories', categoryRoutes)
app.use('/api/equipment-types', equipmentTypeRoutes)

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