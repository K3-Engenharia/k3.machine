import { connectDb } from '../models/db.js';

export async function runMigrations() {
    try {
        const db = await connectDb();
        
        // Lista de coleções que precisamos garantir que existem
        const collections = [
            'users',
            'empresas',
            'equipamentos',
            'agendamentos',
            'tipos_equipamento',
            'locais_instalados'
        ];

        // Pegar lista de coleções existentes
        const existingCollections = await db.listCollections().toArray();
        const existingCollectionNames = existingCollections.map(col => col.name);

        // Criar coleções que não existem
        for (const collection of collections) {
            if (!existingCollectionNames.includes(collection)) {
                await db.createCollection(collection);
                console.log(`Coleção ${collection} criada com sucesso!`);
            }
        }

        console.log('Setup do MongoDB concluído com sucesso!');
    } catch (err) {
        console.error('Erro ao configurar MongoDB:', err);
        throw err;
    }
}
