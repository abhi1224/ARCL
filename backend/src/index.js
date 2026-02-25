import app from './app.js';

app.listen(process.env.PORT, () => {
    console.log(`Server is running at http://localhost:${process.env.PORT}`);    
}) 

app.get('/', (req, res) => {
    res.end('Hello from server')
})