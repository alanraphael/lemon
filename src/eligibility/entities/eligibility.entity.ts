import { ClasseDeConsumoEnum } from '../enums/classe-de-consumo.enum';
import { ModalidadeTarifariaEnum } from '../enums/modalidade-tarifaria.enum';
import { TipoDeConexaoEnum } from '../enums/tipo-de-conexao.enum';
import { HistoricoDeConsumo } from './historico-consumo.entity';

interface IEligibility {
  numeroDoDocumento: string;
  tipoDeConexao: TipoDeConexaoEnum;
  classeDeConsumo: ClasseDeConsumoEnum;
  modalidadeTarifaria: ModalidadeTarifariaEnum;
  historicoDeConsumo: number[];
}

export class EligibilityEntity {
  private _numeroDoDocumento: string;
  private _tipoDeConexao: TipoDeConexaoEnum;
  private _classeDeConsumo: ClasseDeConsumoEnum;
  private _modalidadeTarifaria: ModalidadeTarifariaEnum;
  private _historicoDeConsumo: HistoricoDeConsumo;

  readonly _classeDeConsumoElegivel = [
    'comercial',
    'residencial',
    'industrial',
  ];
  readonly _modalidadeTarifariaElegivel = ['convencional', 'branca'];

  constructor({
    numeroDoDocumento,
    tipoDeConexao,
    classeDeConsumo,
    modalidadeTarifaria,
    historicoDeConsumo,
  }: Partial<IEligibility>) {
    this._numeroDoDocumento = numeroDoDocumento;
    this._tipoDeConexao = tipoDeConexao;
    this._classeDeConsumo = classeDeConsumo;
    this._modalidadeTarifaria = modalidadeTarifaria;
    this._historicoDeConsumo = new HistoricoDeConsumo(historicoDeConsumo);
  }

  validation() {
    const cpf = new RegExp('^\\d{11}$');
    const cnpj = new RegExp('^\\d{14}$');

    if (
      !cpf.test(this._numeroDoDocumento) &&
      !cnpj.test(this._numeroDoDocumento)
    ) {
      throw Error('numeroDoDocumento must be a CPF or CNPJ');
    }

    this._historicoDeConsumo.validation();
  }

  get classeDeConsumo(): string {
    return ClasseDeConsumoEnum[this._classeDeConsumo];
  }

  get modalidadeTarifaria(): string {
    return ModalidadeTarifariaEnum[this._modalidadeTarifaria];
  }

  get tipoDeConexao(): string {
    return TipoDeConexaoEnum[this._tipoDeConexao];
  }

  get historicoDeConsumo() {
    return this._historicoDeConsumo;
  }

  economiaAnualDeCO2() {
    return (this._historicoDeConsumo.total() / 1000) * 84;
  }

  toObject() {
    return {
      numeroDoDocumento: this._numeroDoDocumento,
      tipoDeConexao: this._tipoDeConexao,
      classeDeConsumo: this._classeDeConsumo,
      modalidadeTarifaria: this._modalidadeTarifaria,
      historicoDeConsumo: this._historicoDeConsumo,
    };
  }
}
