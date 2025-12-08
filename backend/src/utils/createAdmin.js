import bcrypt from 'bcryptjs';
import { connectDb } from '../models/db.js';

async function createAdmin() {
    try {
        const db = await connectDb();
        const collection = db.collection('users');

        const name = 'Administrador';
        const username = 'admin';
        const email = 'admin@empresa.com';
        const password = 'japinha123';
        const passwordHash = await bcrypt.hash(password, 10);
        const role = 'admin';
        const isApproved = true;

        // Verificar se o admin já existe
        const adminExists = await collection.findOne({ username });
        
        if (adminExists) {
            // Atualizar senha do admin existente
            await collection.updateOne(
                { username },
                {
                    $set: {
                        password_hash: passwordHash,
                        name,
                        email,
                        role,
                        is_approved: isApproved
                    }
                }
            );
            console.log('Usuário admin atualizado com sucesso!');
        } else {
            // Criar novo usuário admin
            await collection.insertOne({
                name,
                username,
                email,
                password_hash: passwordHash,
                role,
                is_approved: isApproved,
                empresas: [],
                created_at: new Date()
            });
            console.log('Usuário admin criado com sucesso!');
        }

        const admin = await collection.findOne({ username });
        console.log('Dados do admin:', {
            ...admin,
            id: admin._id.toString(),
            password_hash: '******'
        });
        
        process.exit(0);
    } catch (error) {
        console.error('Erro ao criar/atualizar admin:', error);
        process.exit(1);
    }
}

createAdmin();
