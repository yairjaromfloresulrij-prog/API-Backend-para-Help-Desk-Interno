import {
    IsEnum,
    IsOptional,
} from 'class-validator';
import { Role } from '../../generated/prisma/enums.js';

export class FiltroUsuarioDto {
    @IsOptional()
    @IsEnum(Role, 
        { 
            message: 'El rol debe ser ADMIN o AGENTE' 
        }
    )
    role?: Role;
}