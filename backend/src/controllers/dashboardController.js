import { contarProximasIntervencoes, contarEquipamentosPreventivaEmDia } from '../models/agendamentoModel.js';
import { contarEquipamentos } from '../models/equipamentoModel.js';

export async function getDashboardData(req, res) {
    let equipamentos = 0;
    let proximasIntervencoes = 0;
    let preventivasEmDia = 0;
    const userEmpresas = req.user.role === 'admin' ? null : req.user.empresas;

    try {
        equipamentos = await contarEquipamentos(userEmpresas);
        proximasIntervencoes = await contarProximasIntervencoes(userEmpresas);
        preventivasEmDia = equipamentos > 0 
            ? Math.round(await contarEquipamentosPreventivaEmDia(userEmpresas) / equipamentos * 100) 
            : 0;

        res.json({
            equipamentos,
            preventivasEmDia,
            proximasIntervencoes
        });
    } catch (e) {
        console.error('Erro ao buscar dados do dashboard:', e);
        res.status(500).json({ 
            message: 'Erro ao buscar dados do dashboard',
            equipamentos: 0,
            preventivasEmDia: 0,
            proximasIntervencoes: 0
        });
    }
}
