function calcular() {
    const salario = parseFloat(document.getElementById('salario').value);
    const admissao = new Date(document.getElementById('admissao').value);
    const saida = new Date(document.getElementById('saida').value);
    const motivo = document.getElementById('motivo').value;
    const aviso = document.getElementById('aviso').value;

    if (isNaN(salario) || isNaN(admissao) || isNaN(saida)) {
        alert('Preencha todos os campos corretamente!');
        return;
    }

    // 🔸 Tempo total de trabalho
    const diffAnos = saida.getFullYear() - admissao.getFullYear();
    const diffMeses = saida.getMonth() - admissao.getMonth();
    const totalMesesTrabalhados = diffAnos * 12 + diffMeses + 1; // +1 inclui o mês da saída

    // 🔸 Cálculo do saldo de salário (dias no mês da saída)
    const diasTrabalhadosNoMesSaida = saida.getDate();
    const saldoSalario = (salario / 30) * diasTrabalhadosNoMesSaida;

    // 🔸 Aviso Prévio
    let avisoPrevio = 0;
    if (aviso === "indenizado") {
        let diasAviso = 30;
        if (diffAnos >= 1) {
            diasAviso += Math.min(diffAnos * 3, 60); // Acrescenta 3 dias por ano trabalhado
        }
        avisoPrevio = (salario / 30) * diasAviso;
    }

    // 🔸 Férias Vencidas — verifica se completou 12 meses
    const dataUltimasFerias = new Date(admissao);
    dataUltimasFerias.setFullYear(dataUltimasFerias.getFullYear() + 1);
    const temFeriasVencidas = saida >= dataUltimasFerias;
    const feriasVencidas = temFeriasVencidas ? salario + (salario / 3) : 0;

    // 🔸 Férias proporcionais (último período aquisitivo)
    const mesesTrabalhadosNoUltimoPeriodo = 
        (saida.getFullYear() - dataUltimasFerias.getFullYear()) * 12 + 
        (saida.getMonth() - dataUltimasFerias.getMonth()) + 
        (saida.getDate() >= dataUltimasFerias.getDate() ? 1 : 0);

    const mesesFeriasProporcionais = temFeriasVencidas 
        ? mesesTrabalhadosNoUltimoPeriodo 
        : totalMesesTrabalhados > 12 ? totalMesesTrabalhados - 12 : totalMesesTrabalhados;

    const feriasProporcionais = (motivo !== 'justaCausa' && mesesFeriasProporcionais > 0)
        ? ((salario / 12) * mesesFeriasProporcionais) + (((salario / 12) * mesesFeriasProporcionais) / 3)
        : 0;

    // 🔸 13º proporcional (ano da saída)
    const mesesDecimoTerceiro = saida.getMonth() + 1; // janeiro = 0 → +1
    const decimoTerceiro = (motivo !== 'justaCausa')
        ? (salario / 12) * mesesDecimoTerceiro
        : 0;

    // 🔸 Multa de 40% do FGTS (estimada)
    const fgtsMensal = salario * 0.08;
    const totalFgts = fgtsMensal * totalMesesTrabalhados;
    const multaFgts = (motivo === 'semJustaCausa') ? totalFgts * 0.40 : 0;

    // 🔸 Total bruto
    const totalBruto = saldoSalario + avisoPrevio + feriasVencidas + feriasProporcionais + decimoTerceiro + multaFgts;

    // 🔸 Total líquido (sem descontos obrigatórios)
    const totalLiquido = totalBruto;

    // 🔸 Mostrar resultado
    const detalhes = `
        <p><strong>Saldo de salário:</strong> R$ ${saldoSalario.toFixed(2)}</p>
        <p><strong>Aviso prévio:</strong> R$ ${avisoPrevio.toFixed(2)}</p>
        <p><strong>Férias vencidas + 1/3:</strong> R$ ${feriasVencidas.toFixed(2)}</p>
        <p><strong>Férias proporcionais + 1/3:</strong> R$ ${feriasProporcionais.toFixed(2)}</p>
        <p><strong>13º proporcional:</strong> R$ ${decimoTerceiro.toFixed(2)}</p>
        <p><strong>Multa 40% do FGTS:</strong> R$ ${multaFgts.toFixed(2)}</p>
        <hr>
        <p><strong>Total bruto:</strong> R$ ${totalBruto.toFixed(2)}</p>
        <p><strong>Total líquido:</strong> <span style="color:green;">R$ ${totalLiquido.toFixed(2)}</span></p>
    `;

    document.getElementById('detalhes').innerHTML = detalhes;
    document.getElementById('resultado').style.display = 'block';
}
