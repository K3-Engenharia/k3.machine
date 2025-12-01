import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://admin:japinha123@cluster0.7jofxrx.mongodb.net/?appName=Cluster0";
const dbName = 'k3machine';

async function limparTodosOsDados() {
    const client = new MongoClient(uri);
    
    try {
        await client.connect();
        console.log('Conectado ao MongoDB Atlas');
        
        const db = client.db(dbName);
        
        // Limpar empresas
        const empresasCollection = db.collection('empresas');
        const resultEmpresas = await empresasCollection.deleteMany({});
        console.log(`${resultEmpresas.deletedCount} empresas removidas`);
        
        // Limpar equipamentos
        const equipamentosCollection = db.collection('equipamentos');
        const resultEquipamentos = await equipamentosCollection.deleteMany({});
        console.log(`${resultEquipamentos.deletedCount} equipamentos removidos`);
        
        // Limpar agendamentos
        const agendamentosCollection = db.collection('agendamentos');
        const resultAgendamentos = await agendamentosCollection.deleteMany({});
        console.log(`${resultAgendamentos.deletedCount} agendamentos removidos`);
        
        // Limpar tipos de equipamento
        const tiposCollection = db.collection('tipos_equipamento');
        const resultTipos = await tiposCollection.deleteMany({});
        console.log(`${resultTipos.deletedCount} tipos de equipamento removidos`);
        
        // Limpar locais instalados
        const locaisCollection = db.collection('locais_instalados');
        const resultLocais = await locaisCollection.deleteMany({});
        console.log(`${resultLocais.deletedCount} locais instalados removidos`);
        
        // Remover referências de empresas dos usuários
        const usersCollection = db.collection('users');
        const resultUsers = await usersCollection.updateMany(
            {},
            { $set: { empresas: [] } }
        );
        console.log(`${resultUsers.modifiedCount} usuários atualizados`);

        console.log('Limpeza concluída com sucesso!');

    } catch (error) {
        console.error('Erro ao limpar dados:', error);
    } finally {
        await client.close();
        console.log('Conexão com MongoDB fechada');
        process.exit();
    }
}

limparTodosOsDados();