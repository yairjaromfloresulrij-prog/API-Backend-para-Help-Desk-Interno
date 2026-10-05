import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { 
    IsNotEmpty, 
    IsString, 
    MinLength 
} from 'class-validator';

export class CambiarPasswordDto {

    @ApiProperty({
        description: 'Contraseña actual del usuario',
        example: 'Password123',
    })
    @Transform(({ value }) => value.trim())
    @IsString({
        message: 'La contraseña actual debe ser una cadena de texto',
    })
    @IsNotEmpty({
        message: 'La contraseña actual es obligatoria',
    })
    passwordActual: string

    @ApiProperty({
        description: 'Nueva contraseña del usuario',
        example: 'NuevaPassword123',
        minLength: 8,
    })
    @Transform(({ value }) => value.trim())
    @IsString({
        message: 'La nueva contraseña debe ser una cadena de texto',
    })
    @MinLength(8, {
        message: 'La nueva contraseña debe tener al menos 8 caracteres',
    })
    @IsNotEmpty({
        message: 'La nueva contraseña es obligatoria',
    })
    passwordNueva: string;
}