import { ApiProperty } from '@nestjs/swagger';

import { Transform } from 'class-transformer';

import { IsNotEmpty, IsString, MinLength, IsEmail } from 'class-validator';

export class CrearUsuarioDto {
  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Jacinto',
  })
  @Transform(({ value }) => value.trim())
  @IsString({
    message: 'El nombre debe ser una cadena de texto',
  })
  @IsNotEmpty({
    message: 'El nombre es obligatorio',
  })
  name: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Vera',
  })
  @Transform(({ value }) => value.trim())
  @IsString({
    message: 'El apellido debe ser una cadena de texto',
  })
  @IsNotEmpty({
    message: 'El apellido es obligatorio',
  })
  lastName: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'jacinto.vera@gmail.com',
  })
  @Transform(({ value }) => value.trim())
  @IsEmail(
    {},
    {
      message: 'El correo electrónico no es válido',
    },
  )
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
