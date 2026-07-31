window.onload = function () {
    // Evita que a tela desligue
    try {
        tizen.power.request("SCREEN", "SCREEN_NORMAL");
    } catch (e) {
        console.log("Erro ao definir modo de tela: " + e.message);
    }

    // Captura o botão de voltar
    document.addEventListener('tizenhwkey', function (e) {
        if (e.keyName === "back") {
            try {
                // Libera a requisição antes de sair
                tizen.power.release("SCREEN");
                tizen.application.getCurrentApplication().exit();
            } catch (ignore) {}
        }
    });
};
