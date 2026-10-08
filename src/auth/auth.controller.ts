import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegistroDto } from './dto/registro.dto.js';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Registrar usuario',
    description: 'Registra un nuevo usuario en el sistema.',
  })
  @ApiBody({
    type: RegistroDto,
    examples: {
      ejemplo: {
        summary: 'Ejemplo de registro',
        value: {
          name: 'Sofía',
          lastName: 'Martínez',
          email: 'sofia.martinez@empresa.com',
          password: 'Segura123',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado correctamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'Los datos enviados no son válidos.',
  })
  @ApiResponse({
    status: 409,
    description: 'El correo electrónico ya está registrado.',
  })
  register(@Body() registerDto: RegistroDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Iniciar sesión',
    description:
      'Autentica al usuario y devuelve un token JWT para acceder a los endpoints protegidos.',
  })
  @ApiBody({
    type: LoginDto,
    examples: {
      ejemplo: {
        summary: 'Ejemplo de inicio de sesión',
        value: {
          email: 'sofia.martinez@empresa.com',
          password: 'Segura123',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Inicio de sesión exitoso. Se devuelve un token JWT.',
  })
  @ApiResponse({
    status: 401,
    description: 'Correo electrónico o contraseña incorrectos.',
  })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
