import { ToastError } from "../toasts";

export const customDateInput = (inputID) => {
  const informacaoIncorreta = 'Informação inválida para este campo.';
  const inputData = document.getElementById(inputID);
  const dataInputada = inputData.value;
  
  // Se não tiver nada, só sai da função:
  if (dataInputada === '') return;

  // Peças para montar a data final:
  let diaDataFinal = '';
  let mesDataFinal = '';
  let anoDataFinal = '';
  let resultadoDataFinal = '';

  // Primeira Validação: Tem '/'?
  const dataValida = dataInputada.includes('/');

  if (dataValida) {
    const quantidadeBarras = dataInputada.split('/').length - 1;
    const dia = dataInputada.split('/')[0];
    const mes = dataInputada.split('/')[1];

    // Pega o tamanho do DIA e MES informado:
    const lenghtDia = dia.length;
    const lenghtMes = mes.length;

    // Dia:
    if (lenghtDia === 1) {
      if (Number(dia) < 1 || Number(dia) > 31) {
        // Erro: Aplica o estilo no input. Deixa o Fundo vermelho? Avisa o usuário?
        // ToastError(`Não é possivel inserir o dia: ${dia}.\nSó são válidos valores entre 1 e 31.`);
        ToastError(informacaoIncorreta);

        // Foca novamente no input:
        inputData.focus();

        return dataInputada;
      } else {
        diaDataFinal = `0${dia}`
      }
    } else if (lenghtDia === 2) {
      if (Number(dia) < 1 || Number(dia) > 31) {
        // Erro: Aplica o estilo no input. Deixa o Fundo vermelho? Avisa o usuário?
        // ToastError(`Não é possivel inserir o dia: ${dia}.\nSó são válidos valores entre 1 e 31.`);
        ToastError(informacaoIncorreta);

        // Foca novamente no input:
        inputData.focus();

        return dataInputada;
      } else {
        diaDataFinal = dia;
      }
    } else {
      // Erro: Aplica o estilo no input. Deixa o Fundo vermelho? Avisa o usuário?
      // ToastError(`Não é possivel inserir o dia: ${dia}.\nUm dia deve ter no mínimo 1 número e no máximo 2 números.`);
      ToastError(informacaoIncorreta);

      // Foca novamente no input:
      inputData.focus();

      return dataInputada;
    }

    // Mês:
    if (lenghtMes === 1) {
      if (Number(mes) < 1 || Number(mes) > 12) {
        // Erro: Aplica o estilo no input. Deixa o Fundo vermelho? Avisa o usuário?
        // ToastError(`Não é possivel inserir o mês: ${mes}.\nSó são válidos valores entre 1 e 12.`);
        ToastError(informacaoIncorreta);

        // Foca novamente no input:
        inputData.focus();

        return dataInputada;
      } else {
        mesDataFinal = `0${mes}`
      }
    } else if (lenghtMes === 2) {
      if (Number(mes) < 1 || Number(mes) > 12) {
        // Erro: Aplica o estilo no input. Deixa o Fundo vermelho? Avisa o usuário?
        // ToastError(`Não é possivel inserir o mês: ${mes}.\nSó são válidos valores entre 1 e 12.`);
        ToastError(informacaoIncorreta);

        // Foca novamente no input:
        inputData.focus();

        return dataInputada;
      } else {
        mesDataFinal = mes;
      }
    } else {
      // Erro: Aplica o estilo no input. Deixa o Fundo vermelho? Avisa o usuário?
      // ToastError(`Não é possivel inserir o mês: ${mes}.\nUm mês deve ter no mínimo 1 número e no máximo 2 números.`);
      ToastError(informacaoIncorreta);

      // Foca novamente no input:
      inputData.focus();

      return dataInputada;
    }

    // Tem 1 barra: (Ou seja, o usuário informou sem ano)
    if (quantidadeBarras === 1) {
      anoDataFinal = new Date().getFullYear();
    // Tem 2 barras: (Ou seja, o usuário informou com ano)
    } else if (quantidadeBarras === 2) {
      const ano = dataInputada.split('/')[2];

      // Pega o tamanho do ANO informado:
      const lengthAno = ano.length;

      if (lengthAno > 4) {
        // Erro: Aplica o estilo no input. Deixa o Fundo vermelho? Avisa o usuário?
        // ToastError(`Não é possivel inserir a informação: ${dataInputada}.\nEsta informação possui um ano inválido.`);
        ToastError(informacaoIncorreta);

        // Foca novamente no input:
        inputData.focus();
    
        return dataInputada;
      } else if (lengthAno === 1) {
        anoDataFinal = `200${ano}`;
      } else if (lengthAno === 2) {
        anoDataFinal = `20${ano}`;
      } else {
        anoDataFinal = ano;
      }

    // Tem 3 barras ou mais:
    } else {
      // Erro: Aplica o estilo no input. Deixa o Fundo vermelho? Avisa o usuário?
      // ToastError(`Não é possivel inserir a informação: ${dataInputada}.\nEsta informação possui barras em excesso.`);
      ToastError(informacaoIncorreta);

      // Foca novamente no input:
      inputData.focus();
   
      return dataInputada;
    }
  } else {
    // Erro: Aplica o estilo no input. Deixa o Fundo vermelho? Avisa o usuário?
    // ToastError(`Não é possivel inserir a informação: ${dataInputada}.\nEsta informação não é uma data.`);
    ToastError(informacaoIncorreta);

    // Foca novamente no input:
    inputData.focus();

    return dataInputada;
  }

  // Faz o Frankenstein:
  resultadoDataFinal = `${diaDataFinal}/${mesDataFinal}/${anoDataFinal}`

  return resultadoDataFinal;
};