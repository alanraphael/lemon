import { Injectable } from '@nestjs/common';
import { EligibilityEntity } from './entities/eligibility.entity';
import { TipoDeConexaoEnum } from './enums/tipo-de-conexao.enum';
import { ClasseDeConsumoEnum } from './enums/classe-de-consumo.enum';
import { ModalidadeTarifariaEnum } from './enums/modalidade-tarifaria.enum';
import { NotEligibleEnum } from './enums/not-eligible.enum';

@Injectable()
export class EligibilityService {
  private readonly _classeDeConsumoElegivel = [
    ClasseDeConsumoEnum.comercial,
    ClasseDeConsumoEnum.residencial,
    ClasseDeConsumoEnum.industrial,
  ];
  private readonly _modalidadeTarifariaElegivel = [
    ModalidadeTarifariaEnum.convencional,
    ModalidadeTarifariaEnum.branca,
  ];

  private _isMonofasico(media): boolean {
    return media >= 400;
  }

  private _isBifasico(media): boolean {
    return media >= 500;
  }

  private _isTrifasico(media): boolean {
    return media >= 750;
  }

  private _checkConectionType(eligibility: EligibilityEntity): boolean {
    if (eligibility.tipoDeConexao === TipoDeConexaoEnum.monofasico) {
      return this._isMonofasico(eligibility.historicoDeConsumo.average());
    }

    if (eligibility.tipoDeConexao === TipoDeConexaoEnum.bifasico) {
      return this._isBifasico(eligibility.historicoDeConsumo.average());
    }

    if (eligibility.tipoDeConexao === TipoDeConexaoEnum.trifasico) {
      return this._isTrifasico(eligibility.historicoDeConsumo.average());
    }
  }

  checkEligibility(eligibility: EligibilityEntity): string[] {
    const hasConsumptionClass = this._classeDeConsumoElegivel.indexOf(
      ClasseDeConsumoEnum[eligibility.classeDeConsumo],
    );
    const hasModality = this._modalidadeTarifariaElegivel.indexOf(
      ModalidadeTarifariaEnum[eligibility.modalidadeTarifaria],
    );

    const notEligible = [];

    if (hasConsumptionClass === -1)
      notEligible.push(NotEligibleEnum.classNotValid);

    if (hasModality === -1) notEligible.push(NotEligibleEnum.modalityNotValid);

    if (!this._checkConectionType(eligibility))
      notEligible.push(NotEligibleEnum.consumptionLow);

    return notEligible;
  }
}
