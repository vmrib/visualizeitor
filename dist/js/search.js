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
      const name = $(e).find("NOME_ATIV_CURRIC").text();

      return {
        subject,
        year,
        period,
        status,
        type,
        grade,
        frequency,
        name,
      };
    })
    .get()
    .reduce((acc, curr) => {

      let entry;

      if (curr.type !== "Trabalho de Graduação I" && curr.type !== "Trabalho de Graduação II") {
        entry = curr.subject;
      }
      else if (curr.type === "Trabalho de Graduação I") {
        entry = "TG I";
      }
      else if (curr.type === "Trabalho de Graduação II") {
        entry = "TG II";
      }

      if (acc[entry] === undefined) {
        acc[entry] = [];
      }

      acc[entry].push({
        year: curr.year,
        period: curr.period,
        status: curr.status,
        type: curr.type,
        grade: curr.grade,
        frequency: curr.frequency,
        name: curr.name,
      });

      return acc;
    }, {});
}

function renderHistory() {

  if (history === null) {
    $("main").html(
      `<div class="grow">
        <h1 class="text-9xl font-bold text-center text-dracula-current-line mb-10">( ͡° ʖ̯ ͡°)</h1>
        <h2 class="text-5xl font-bold text-center text-dracula-current-line">Erro ao carregar o banco de dados</h2>
      </div>`
    );
  }

  else if (Object.keys(history).length === 0) {
    $("main").html(
      `<div class="grow">
        <h1 class="text-9xl font-bold text-center text-dracula-current-line mb-10">¯\\_(ツ)_/¯</h1>
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

    if (recent.type !== "Optativas") {
      $("span:contains('" + subject + "')")
        .parent()
        .addClass("cursor-pointer")
        .removeClass("border-dracula-selection")
        .addClass(color)
        .on("click", () => {
          $("main").append(
            `<div class="modal-subject-overlay fixed top-0 w-full h-full grid place-items-center bg-opacity-50 bg-dracula-background z-10">
              <div class="modal-subject flex flex-col items-center justify-center bg-dracula-background shadow-md rounded-2xl p-4">
                <span class="modal-subject-close cursor-pointer ml-auto text-xzl text-bold">&times;</span>
                <div class="flex flex-col items-center justify-center mb-8 pl-2 pr-2 w-full">
                  <h1 class="font-bold text-2xl text-center text-dracula-foreground">${subject}</h1>
                  <h2 class="font-semibold text-center text-dracula-foreground">${recent.name}</h2>
                </div>
                <div class="flex items-center pl-2 pr-2 w-full gap-20">
                  <h3 class="text-lg font-bold text-dracula-foreground">${recent.year}/${recent.period}</h3>
                </div>
                <div class="flex items-center justify-between mt-2 pl-2 pr-2 w-full gap-20">
                  <h4 class="font-semibold text-center text-dracula-foreground">Nota</h4>
                  <span class="shrink">${recent.grade}</span>
                </div>
                <div class="flex items-center justify-between mb-6 mt-2 pl-2 pr-2 gap-20 w-full">
                  <h4 class="font-semibold text-center text-dracula-foreground">Frequência</h4>
                  <span class="shrink">${parseInt(recent.frequency)}</span>
                </div>
              </div>
            </div>`
          );

          $(".modal-subject-close").on("click", () => $(".modal-subject-overlay").remove());
          $(".modal-subject-overlay").on("click", () => $(".modal-subject-overlay").remove());
          $(".modal-subject").on("click", (e) => e.stopPropagation());
        })
        .on("contextmenu", () => {
          $("main").append(
            `<div class="modal-history-overlay fixed top-0 w-full h-full grid place-items-center bg-opacity-50 bg-dracula-background z-10">
              <div class="modal-history flex flex-col items-center justify-center bg-dracula-background shadow-md rounded-2xl p-4">
                <span class="modal-history-close cursor-pointer ml-auto text-xzl text-bold">&times;</span>
                <div class="flex flex-col items-center justify-center mb-8 pl-2 pr-2 w-full">
                  <h1 class="font-bold text-2xl text-center text-dracula-foreground">${subject}</h1>
                  <h2 class="font-semibold text-center text-dracula-foreground">${recent.name}</h2>
                </div>
                <div class="modal-history-content overflow-auto max-h-60 p-0 w-full"></div>
              </div>
            </div>`
          );
          
          $(".modal-history-close").on("click", () => $(".modal-history-overlay").remove());
          $(".modal-history-overlay").on("click", () => $(".modal-history-overlay").remove());
          $(".modal-history").on("click", (e) => e.stopPropagation());
          
          history.forEach((entry) => {
            $(".modal-history-content").append(
              `<div class="flex items-center pl-2 pr-2 w-full gap-20">
                <h3 class="text-lg font-bold text-dracula-foreground">${entry.year}/${entry.period}</h3>
              </div>
              <div class="flex items-center justify-between mt-2 pl-2 pr-2 w-full gap-20">
                <h4 class="font-semibold text-center text-dracula-foreground">Nota</h4>
                <span class="shrink">${entry.grade}</span>
              </div>
              <div class="flex items-center justify-between mb-8 mt-2 pl-2 pr-2 gap-20 w-full">
                <h4 class="font-semibold text-center text-dracula-foreground">Frequência</h4>
                <span class="shrink">${parseInt(entry.frequency)}</span>
              </div>`
            );
    
          });
    
          return false;
        });

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
  $("title").html(grr + " | Visualizeitor");

  renderHistory();
  console.log(history);
});
