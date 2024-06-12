import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsString } from 'class-validator';
import { ClasseDeConsumoEnum } from '../enums/classe-de-consumo.enum';
import { TipoDeConexaoEnum } from '../enums/tipo-de-conexao.enum';
import { ModalidadeTarifariaEnum } from '../enums/modalidade-tarifaria.enum';

export class InputCalculateEligibiliyDto {
  @ApiProperty({ type: String })
  @IsString()
  numeroDoDocumento: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsEnum(TipoDeConexaoEnum)
  tipoDeConexao: TipoDeConexaoEnum;

  @ApiProperty({ type: String })
  @IsString()
  @IsEnum(ClasseDeConsumoEnum)
  classeDeConsumo: ClasseDeConsumoEnum;

  @ApiProperty({ type: String })
  @IsString()
  @IsEnum(ModalidadeTarifariaEnum)
  modalidadeTarifaria: ModalidadeTarifariaEnum;

  @ApiProperty({ type: [] })
  @IsArray()
  historicoDeConsumo: number[];
}
