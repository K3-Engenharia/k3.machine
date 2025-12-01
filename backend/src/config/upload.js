import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configurar o armazenamento das imagens
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Salvando na pasta uploads dentro de public
        cb(null, path.join(__dirname, '../../public/uploads/'));
    },
    filename: function (req, file, cb) {
        // Gerando um nome único para o arquivo
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Filtrar tipos de arquivo permitidos
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de arquivo não suportado! Apenas JPEG, JPG, PNG e GIF são permitidos.'), false);
    }
};

// Configurar o upload
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // Limite de 5MB
    }
});

export default upload;