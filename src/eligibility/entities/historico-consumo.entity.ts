export class HistoricoDeConsumo {
  private _historicoDeConsumo: number[];

  private _minItems = 3;
  private _maxItems = 12;
  private _valueMinimum = 0;
  private _valueMaximum = 9999;

  constructor(historico: number[]) {
    this._historicoDeConsumo = historico;
  }

  validation() {
    if (
      this._historicoDeConsumo.length < this._minItems ||
      this._historicoDeConsumo.length > this._maxItems
    ) {
      throw Error('historicoDeConsumo must be minimum 3 and maximum 12 items');
    }

    for (const value of this._historicoDeConsumo) {
      if (value < this._valueMinimum || value > this._valueMaximum) {
        throw Error(
          'historicoDeConsumo values must be minimum 0 and maximum 9999',
        );
      }
    }
  }

  total() {
    return this._historicoDeConsumo.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0,
    );
  }

  average() {
    return this.total() / this._historicoDeConsumo.length;
  }
}
