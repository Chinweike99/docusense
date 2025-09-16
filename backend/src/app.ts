// src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './utils/config';
import documentRoutes from './routes/documentRoutes';
// import chatRoutes from './routes/chatRoutes';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', documentRoutes);
// app.use('/api', chatRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// app.use('*', (req, res) => {
//   res.status(404).json({ error: 'Endpoint not found' });
// });

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// const PORT = config.PORT;

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

export default app;