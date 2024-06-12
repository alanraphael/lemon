import { ApiProperty } from '@nestjs/swagger';

export class ShowEligibilityDto {
  @ApiProperty()
  elegive: boolean;

  @ApiProperty()
  razoesDeInelegibilidade?: string[];

  @ApiProperty()
  economiaAnualDeCO2?: number;

  constructor({
    razoesDeInelegibilidade,
    economiaAnualDeCO2,
  }: Partial<ShowEligibilityDto>) {
    this.elegive = razoesDeInelegibilidade?.length > 0 ? false : true;
    if (razoesDeInelegibilidade)
      this.razoesDeInelegibilidade = razoesDeInelegibilidade;
    if (economiaAnualDeCO2) this.economiaAnualDeCO2 = economiaAnualDeCO2;
  }
}
