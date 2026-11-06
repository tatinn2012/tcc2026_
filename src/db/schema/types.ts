/** Tipos JSONB usados nas configurações versionadas das regras. */
export type TrucoRulesConfig = {
  modalidade: "MINEIRO";
  baralho: {
    quantidade: 40;
    cartasExcluidas: string[];
    curingas: false;
    usaVira: false;
  };
  jogadoresPorDupla: 2;
  cartasPorJogador: 3;
  pontuacao: {
    pontosParaVencer: number;
    valorInicialDaMao: number;
    escadaChamadas: Array<{ codigo: string; pontos: number }>;
  };
  manilhas: string[];
  maoDeDez: {
    ativa: boolean;
    limite: number;
    valorSeJogar: number;
    permiteTruco: boolean;
    parceiroPodeVerCartas: boolean;
  };
  maoDeFerro: {
    ativa: boolean;
    limiteAmbasDuplas: number;
    cartasOcultas: boolean;
  };
  regrasEspeciais: {
    empateNaVaza: "REGRA_CONFIGURADA";
    empateNaMao: "REGRA_CONFIGURADA";
  };
};

export type JsonObject = Record<string, unknown>;
