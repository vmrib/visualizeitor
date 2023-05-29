jQuery(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const grr = urlParams.get("grr");

  $("#search-bar-grr").val(grr);

  let $alunoXML;
  $.ajax({
    async: false,
    url: "db/alunos.xml",
    dataType: "xml",
    success: (xml) => {
      $alunoXML = $(xml)
        .find("MATR_ALUNO:contains('" + grr + "')")
        .parent();
    },
    error: (err) => {
      console.log(err);
    },
  });

  $alunoXML
    .filter((_, e) => $(e).find("SIGLA").text() === "Aprovado")
    .find("COD_ATIV_CURRIC")
    .each((_, e) => {
      const subject = $(e).text();
      $("span:contains('" + subject + "')")
        .parent()
        .addClass("bg-dracula-green");
    });

  // $alunoXML
  //   .filter((_, e) => $(e).find("SIGLA").text() === "Reprovado")
  //   .find("COD_ATIV_CURRIC")
  //   .each((_, e) => {
  //     const subject = $(e).text();
  //     console.log(subject);
  //     $("span:contains('" + subject + "')")
  //       .parent()
  //       .addClass("bg-dracula-red");
  //   });

  $alunoXML.find("COD_ATIV_CURRIC").each((_, e) => {
    const subject = $(e).text();
    console.log(subject);
    $("span:contains('" + subject + "')")
      .parent()
      .on("click", () => {
        $("#modal-subject").show();
        $("#modal-subject-title").text(subject);
      })
      .addClass("cursor-pointer");
  });
});
