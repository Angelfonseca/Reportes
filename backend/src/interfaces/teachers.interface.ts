
export interface teacher {
    nombre: string;
    contrasena: string;
    usuario: string;
    fotografia: string;
    isAdmin: boolean;
    cambioContrasena: boolean;
}

export interface TeacherDocument extends teacher, Document {
    comparePassword(candidatePassword: string): Promise<boolean>;
}
