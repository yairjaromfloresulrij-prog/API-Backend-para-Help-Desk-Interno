import { Transform } from 'class-transformer';
import{ 
    IsEmail, 
    IsNotEmpty, 
    IsString, 
    MinLength 
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegistroDto {
    
    @ApiProperty({
        description: 'Nombre del usuario',
        example: 'Lucas',
    })
    @Transform(({ value }) => value.trim())
    @IsNotEmpty({ 
        message: 'El nombre es obligatorio',
    })
    @IsString({ 
        message: 'El nombre debe ser una cadena de texto',
     })
    name: string;

    @ApiProperty({
        description: 'Apellido del usuario',
        example: 'Gonzalez',
    })
    @Transform(({ value }) => value.trim())
    @IsString({
        message: 'El apellido debe ser una cadena de texto',
    })
    @ApiProperty({
        description: 'Apellido del usuario',
        example: 'Gonzalez',
    })
    @IsNotEmpty({
        message: 'El apellido es obligatorio',
    })
    lastname: string;


    @ApiProperty({
        description: 'Correo electrónico del usuario',
        example: 'lucas.gonzalez@gmail.com',
    })
    @Transform(({ value }) => value.trim())
    @IsEmail({}, {
        message: 'El correo electrónico debe tener un formato válido',
    })
    @IsNotEmpty({
        message: 'El correo electrónico es obligatorio',
    })
    email: string;

    @ApiProperty({
        description: 'Contraseña del usuario',
        example: 'Password123',
        minLength: 8,
    })
    @Transform(({ value }) => value.trim())
    @IsString({
            message: 'La contraseña debe ser una cadena de texto',
    })
    @MinLength(8, {
        message: 'La contraseña debe tener al menos 8 caracteres',
    })
    @IsNotEmpty({
        message: 'La contraseña es obligatoria',
    })
    password: string;

}