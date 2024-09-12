import { report } from './reports.interface';
export interface student {
    nombre: string;
    contrasena: string;
    semestre: string;
    especialidad: string;
    usuario: string;
    reportes: report[];
}
