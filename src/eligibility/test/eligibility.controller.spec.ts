import { Test, TestingModule } from '@nestjs/testing';
import { EligibilityController } from '../eligibility.controller';
import { EligibilityService } from '../eligibility.service';
import { InputCalculateEligibiliyDto } from '../dto/input-calculate-eligibility.dto';
import { TipoDeConexaoEnum } from '../enums/tipo-de-conexao.enum';
import { ClasseDeConsumoEnum } from '../enums/classe-de-consumo.enum';
import { ModalidadeTarifariaEnum } from '../enums/modalidade-tarifaria.enum';

const MockEligibleClient: InputCalculateEligibiliyDto = {
  numeroDoDocumento: '14041737706',
  tipoDeConexao: TipoDeConexaoEnum.bifasico,
  classeDeConsumo: ClasseDeConsumoEnum.comercial,
  modalidadeTarifaria: ModalidadeTarifariaEnum.convencional,
  historicoDeConsumo: [
    3878, 9760, 5976, 2797, 2481, 5731, 7538, 4392, 7859, 4160, 6941, 4597,
  ],
};

const MockNotEligibleClient: InputCalculateEligibiliyDto = {
  numeroDoDocumento: '14041737706',
  tipoDeConexao: TipoDeConexaoEnum.bifasico,
  classeDeConsumo: ClasseDeConsumoEnum.rural,
  modalidadeTarifaria: ModalidadeTarifariaEnum.verde,
  historicoDeConsumo: [
    3878, 9760, 5976, 2797, 2481, 5731, 7538, 4392, 7859, 4160,
  ],
};

describe('Eligibility Controller Integration', () => {
  let moduleRef: TestingModule;
  let eligibilityController: EligibilityController;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      controllers: [EligibilityController],
      providers: [EligibilityService],
    }).compile();

    eligibilityController = moduleRef.get<EligibilityController>(
      EligibilityController,
    );
  });

  describe('Eligible client', () => {
    it('Should return elegive true', async () => {
      const eligibility =
        await eligibilityController.checkEligibility(MockEligibleClient);
      await expect(eligibility.elegive).toEqual(true);
    });

    it('Should return economiaAnualDeCO2 with valide value', async () => {
      const eligibility =
        await eligibilityController.checkEligibility(MockEligibleClient);
      await expect(eligibility.economiaAnualDeCO2).toEqual(5553.24);
    });
  });

  describe('Not eligible client', () => {
    it('Should return elegive false', async () => {
      const eligibility = await eligibilityController.checkEligibility(
        MockNotEligibleClient,
      );
      await expect(eligibility.elegive).toEqual(false);
    });

    it('Should return razoesDeInelegibilidade', async () => {
      const eligibility = await eligibilityController.checkEligibility(
        MockNotEligibleClient,
      );
      await expect(eligibility.razoesDeInelegibilidade).toEqual([
        'Classe de consumo não aceita',
        'Modalidade tarifária não aceita',
      ]);
    });
  });

  describe('Validations', () => {
    it('Should return numeroDoDocumento error', async () => {
      const mock: InputCalculateEligibiliyDto = {
        ...MockEligibleClient,
        numeroDoDocumento: '2546987420321',
      };

      try {
        await eligibilityController.checkEligibility(mock);
      } catch (error) {
        await expect(error.message).toEqual(
          'numeroDoDocumento must be a CPF or CNPJ',
        );
      }
    });

    it('Should return "Consumo muito baixo para tipo de conexão"', async () => {
      const mock: InputCalculateEligibiliyDto = {
        ...MockEligibleClient,
        historicoDeConsumo: [123, 1234, 99],
      };

      const eligibility = await eligibilityController.checkEligibility(mock);
      await expect(eligibility.razoesDeInelegibilidade).toEqual([
        'Consumo muito baixo para tipo de conexão',
      ]);
    });

    it('Should return historicoDeConsumo error when there are less than 3 items', async () => {
      const mock: InputCalculateEligibiliyDto = {
        ...MockEligibleClient,
        historicoDeConsumo: [123, 1234],
      };

      try {
        await eligibilityController.checkEligibility(mock);
      } catch (error) {
        await expect(error.message).toEqual(
          'historicoDeConsumo must be minimum 3 and maximum 12 items',
        );
      }
    });

    it('Should return historicoDeConsumo error when there are more than 12 items', async () => {
      const mock: InputCalculateEligibiliyDto = {
        ...MockEligibleClient,
        historicoDeConsumo: [123, 1234, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
      };

      try {
        await eligibilityController.checkEligibility(mock);
      } catch (error) {
        await expect(error.message).toEqual(
          'historicoDeConsumo must be minimum 3 and maximum 12 items',
        );
      }
    });
  });
});
