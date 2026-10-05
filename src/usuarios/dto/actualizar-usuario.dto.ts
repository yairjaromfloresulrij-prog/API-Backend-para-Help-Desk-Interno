import { ApiPropertyOptional } from '@nestjs/swagger'; 
import { Transform } from 'class-transformer'; 
import { 
    IsEmail, 
    IsOptional, 
    IsString, 
    IsNotEmpty, 
} from 'class-validator';

export class ActualizarUsuarioDto {

    @ApiPropertyOptional({
        description: 'Nuevo nombre del usuario',
        example: 'Luciano',
    })
    @Transform(({ value }) => value.trim())
    @IsOptional()
    @IsString({
        message: 'El nombre debe ser una cadena de texto',
    })
    @IsNotEmpty({
        message: 'El nombre no puede estar vacío',
    })
    name?: string;

    @ApiPropertyOptional({
        description: 'Nuevo apellido del usuario',
        example: 'Rodríguez',
    })
    @Transform(({ value }) => value.trim())
    @IsOptional()
    @IsString({
        message: 'El apellido debe ser una cadena de texto',
    })
    @IsNotEmpty({
        message: 'El apellido no puede estar vacío',
    })
    lastname?: string;

    @ApiPropertyOptional({
        description: 'Nuevo correo electrónico del usuario',
        example: 'luciano.rodriguez.nuevo@gmail.com',
    })
    @Transform(({ value }) => value.trim().toLowerCase())
    @IsOptional()
    @IsEmail(
        {},
        {
        message: 'El correo electrónico debe ser  válido',
    },
)
    email?: string;
}