import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Garantir que as variáveis de ambiente sejam carregadas
dotenv.config();

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'k3machine';

console.log('MONGO_URI carregado:', uri ? '✓ URI definida' : '✗ URI não definida');
console.log('Conectando ao MongoDB...');
let client;
let db;

export async function connectDb() {
    if (!client) {
        try {
            client = new MongoClient(uri);
            await client.connect();
            console.log('Conectado ao MongoDB Atlas com sucesso!');
            db = client.db(dbName);
        } catch (error) {
            console.error('Erro ao conectar ao MongoDB:', error);
            throw error;
        }
    }
    return db;
}

export async function getCollection(collectionName) {
    const db = await connectDb();
    return db.collection(collectionName);
}

export async function closeConnection() {
    if (client) {
        await client.close();
        client = null;
        db = null;
        console.log('Conexão com MongoDB fechada');
    }
}

// Garante que a conexão será fechada quando a aplicação for encerrada
process.on('SIGINT', async () => {
    await closeConnection();
    process.exit();
});
