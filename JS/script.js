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

    // 🔸 Tempo de trabalho total
    const diffAnos = saida.getFullYear() - admissao.getFullYear();
    const diffMeses = saida.getMonth() - admissao.getMonth();
    const totalMesesTrabalhados = diffAnos * 12 + diffMeses + 1;

    // 🔸 Saldo de salário
    const diasTrabalhadosNoMesSaida = saida.getDate();
    const saldoSalario = (salario / 30) * diasTrabalhadosNoMesSaida;

    // 🔸 Aviso Prévio
    let avisoPrevio = 0;
    if (aviso === "indenizado") {
        let diasAviso = 30;
        if (diffAnos >= 1) {
            diasAviso += Math.min(diffAnos * 3, 60); // Máx 90 dias
        }
        avisoPrevio = (salario / 30) * diasAviso;
    }

    // 🔸 Férias vencidas: completou ao menos 1 ano
    const dataPrimeirasFerias = new Date(admissao);
    dataPrimeirasFerias.setFullYear(dataPrimeirasFerias.getFullYear() + 1);
    const temFeriasVencidas = saida >= dataPrimeirasFerias;
    const feriasVencidas = temFeriasVencidas ? salario + (salario / 3) : 0;

    // 🔸 Férias proporcionais (se não for justa causa)
    const mesesProporcionais = saida.getMonth() + (saida.getDate() >= 15 ? 1 : 0);
    const feriasProporcionais = motivo !== 'justaCausa'
        ? ((salario / 12) * mesesProporcionais) + (((salario / 12) * mesesProporcionais) / 3)
        : 0;

    // 🔸 13º proporcional (considera se trabalhou pelo menos 15 dias do mês)
    const mesesDecimo = saida.getMonth() + (saida.getDate() >= 15 ? 1 : 0);
    const decimoTerceiro = motivo !== 'justaCausa'
        ? (salario / 12) * mesesDecimo
        : 0;

    // 🔸 Multa 40% do FGTS
    const fgtsMensal = salario * 0.08;
    const totalFgts = fgtsMensal * totalMesesTrabalhados;
    const multaFgts = motivo === 'semJustaCausa' ? totalFgts * 0.4 : 0;

    // 🔸 Total
    const totalBruto = saldoSalario + avisoPrevio + feriasVencidas + feriasProporcionais + decimoTerceiro + multaFgts;
    const totalLiquido = totalBruto;

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
