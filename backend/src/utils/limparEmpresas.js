import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://admin:japinha123@cluster0.7jofxrx.mongodb.net/?appName=Cluster0";
const dbName = 'k3machine';

async function limparEmpresas() {
    const client = new MongoClient(uri);
    
    try {
        await client.connect();
        console.log('Conectado ao MongoDB Atlas');
        
        const db = client.db(dbName);
        const empresasCollection = db.collection('empresas');
        
        // Deletar todas as empresas
        const resultado = await empresasCollection.deleteMany({});
        
        console.log(`${resultado.deletedCount} empresas foram removidas com sucesso!`);

    } catch (error) {
        console.error('Erro ao limpar empresas:', error);
    } finally {
        await client.close();
        console.log('Conexão com MongoDB fechada');
        process.exit();
    }
}

limparEmpresas();