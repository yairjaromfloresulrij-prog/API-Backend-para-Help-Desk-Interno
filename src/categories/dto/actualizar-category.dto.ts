import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class ActualizarCategoryDto {
    @IsOptional()
    @IsString({
        message: 'El nombre debe ser una cadena de texto',
    })
    @IsNotEmpty({
        message: 'El nombre es obligatorio',
    })
    @MaxLength(100, {
        message: 'El nombre no puede superar los 100 caracteres',
    })
    name?: string;

    @IsOptional()
    @IsString({
        message: 'La descripción debe ser una cadena de texto',
    })
    description?: string;
}