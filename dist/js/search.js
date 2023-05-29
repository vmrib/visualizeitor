const urlParams = new URLSearchParams(window.location.search);
const grr = urlParams.get("grr");
const history = getHistory();

function getHistory() {
  let history;

  $.ajax({
    async: false,
    url: "db/alunos.xml",
    dataType: "xml",
    success: (xml) => {
      history = XMLToHistory(xml);
    },
    error: (err) => {
      console.log(err);
      history = null;
    },
  });

  return history;
}

function XMLToHistory(xml) {
  return $(xml)
    .find("MATR_ALUNO:contains('" + grr + "')")
    .parent()
    .map((_, e) => {
      const subject = $(e).find("COD_ATIV_CURRIC").text();
      const year = $(e).find("ANO").text();
      const period = $(e).find("PERIODO").text();
      const status = $(e).find("SITUACAO").text();
      const type = $(e).find("DESCR_ESTRUTURA").text();
      const grade = $(e).find("MEDIA_FINAL").text();
      const frequency = $(e).find("FREQUENCIA").text();

      return {
        subject,
        year,
        period,
        status,
        type,
        grade,
        frequency,
      };
    })
    .get()
    .reduce((acc, curr) => {
      if (acc[curr.subject] === undefined) {
        acc[curr.subject] = [];
      }

      acc[curr.subject].push({
        year: curr.year,
        period: curr.period,
        status: curr.status,
        type: curr.type,
        grade: curr.grade,
        frequency: curr.frequency,
      });

      return acc;
    }, {});
}

function renderHistory() {
  if (history === null) {
    $("main").html(
      `<div class="grow">
        <h1 class="text-9xl font-bold text-center text-dracula-current-line mb-8">¯\\_(ツ)_/¯</h1>
        <h2 class="text-5xl font-bold text-center text-dracula-current-line">GRR não encontrado</h2>
      </div>`
    );
  }

  Object.entries(history).forEach(([subject, history]) => {
    let color;
    const recent = history[history.length - 1];

    switch (recent.status) {
      case "Aprovado":
        color = "bg-dracula-green border-dracula-green";
        break;

      case "Reprovado":
      case "Reprovado por nota":
      case "Reprovado sem nota":
      case "Reprovado por Frequência":
        color = "bg-dracula-red border-dracula-red";
        break;

      case "Matrícula":
        color = "bg-dracula-cyan border-dracula-cyan";
        break;

      case "Equivalência de Disciplina":
        color = "bg-dracula-yellow border-dracula-yellow";
        break;

      default:
        color = "bg-dracula-foreground border-dracula-foreground";
    }

    if (recent.type === "Obrigatórias") {
      $("span:contains('" + subject + "')")
        .parent()
        .addClass("cursor-pointer")
        .removeClass("border-dracula-selection")
        .addClass(color);
    }
    // } else if (recent.type === "Optativas") {
    //   $("span:contains('OPT')")
    //     .parent()
    //     .addClass("cursor-pointer")
    //     .removeClass("border-dracula-selection")
    //     .addClass(color);
    // }
  });
}

jQuery(() => {
  $("#search-bar-grr").val(grr);

  renderHistory();
  console.log(history);
});
