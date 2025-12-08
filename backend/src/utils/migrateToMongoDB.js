import Database from 'better-sqlite3';
import { MongoClient, ObjectId } from 'mongodb';

const uri = "mongodb+srv://admin:japinha123@cluster0.7jofxrx.mongodb.net/?appName=Cluster0";
const dbName = 'k3machine';

async function migrateData() {
    // Conectar ao MongoDB
    const client = new MongoClient(uri);
    
    try {
        await client.connect();
        console.log('Conectado ao MongoDB Atlas');
        const db = client.db(dbName);

        // Conectar ao SQLite
        const sqliteDb = new Database('./k3machine.sqlite');
        
        // Migrar empresas
        console.log('Migrando empresas...');
        const empresas = sqliteDb.prepare('SELECT * FROM empresas').all();
        if (empresas.length > 0) {
            const empresasCollection = db.collection('empresas');
            await empresasCollection.insertMany(
                empresas.map(empresa => ({
                    _id: new ObjectId(),
                    nome: empresa.nome,
                    created_at: new Date()
                }))
            );
        }

        // Criar mapa de IDs antigos para novos
        const empresasMap = new Map();
        const empresasFromMongo = await db.collection('empresas').find().toArray();
        empresas.forEach((empresa, index) => {
            empresasMap.set(empresa.id, empresasFromMongo[index]._id);
        });

        // Migrar equipamentos
        console.log('Migrando equipamentos...');
        const equipamentos = sqliteDb.prepare('SELECT * FROM equipamentos').all();
        if (equipamentos.length > 0) {
            const equipamentosCollection = db.collection('equipamentos');
            await equipamentosCollection.insertMany(
                equipamentos.map(equip => ({
                    _id: new ObjectId(),
                    empresa_id: empresasMap.get(equip.empresa_id),
                    nome: equip.nome,
                    tipo: equip.tipo,
                    modelo: equip.modelo,
                    fabricante: equip.fabricante,
                    potencia: equip.potencia,
                    corrente_nominal: equip.corrente_nominal,
                    tensao_nominal: equip.tensao_nominal,
                    local_instalado: equip.local_instalado,
                    tag_planta: equip.tag_planta,
                    data_instalacao: equip.data_instalacao,
                    anexo: equip.anexo,
                    status: equip.status || 'Em Operação',
                    rolamento: equip.rolamento,
                    created_at: new Date(equip.created_at) || new Date()
                }))
            );
        }

        // Criar mapa de IDs de equipamentos
        const equipamentosMap = new Map();
        const equipamentosFromMongo = await db.collection('equipamentos').find().toArray();
        equipamentos.forEach((equip, index) => {
            equipamentosMap.set(equip.id, equipamentosFromMongo[index]._id);
        });

        // Migrar agendamentos
        console.log('Migrando agendamentos...');
        const agendamentos = sqliteDb.prepare('SELECT * FROM agendamentos').all();
        if (agendamentos.length > 0) {
            const agendamentosCollection = db.collection('agendamentos');
            await agendamentosCollection.insertMany(
                agendamentos.map(agend => ({
                    _id: new ObjectId(),
                    equipamento_id: equipamentosMap.get(agend.equipamento_id),
                    data_hora: agend.data_hora,
                    tempo_estimado: agend.tempo_estimado,
                    responsavel: agend.responsavel,
                    checklist: agend.checklist,
                    observacoes: agend.observacoes,
                    periodicidade: agend.periodicidade,
                    proximo_agendamento: agend.proximo_agendamento,
                    status: agend.status,
                    created_at: new Date()
                }))
            );
        }

        console.log('Migração concluída com sucesso!');
        
    } catch (error) {
        console.error('Erro durante a migração:', error);
    } finally {
        await client.close();
    }
}

// Executar migração
migrateData().then(() => {
    console.log('Script de migração finalizado');
    process.exit(0);
}).catch(error => {
    console.error('Erro fatal durante a migração:', error);
    process.exit(1);
});