import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.routes.js'
import propertyRoutes from './routes/property.routes.js'


const app = express()
app.use(helmet())
app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/properties', propertyRoutes)


app.get('/api/health', (req,res) =>{
res.status(200).json({
    success:true,
    message:'server is running'
})
})


export default app;