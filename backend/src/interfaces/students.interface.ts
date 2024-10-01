import { report } from './reports.interface';
export interface student {
    nombre: string;
    contrasena: string;
    semestre: string;
    grupo: string;
    usuario: string;
    fotografia: string;
    reportes: report[];
    puntos: number;
}
