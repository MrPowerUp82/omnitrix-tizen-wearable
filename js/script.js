const aliens = [
    {
        name: 'swampfire',
        src: 'swampfire.png',
        scale: 1.0
    },
    {
        name: 'bigchill',
        src: 'bigchill.png',
        scale: 1.0
    },
    {
        name: 'humungousaur',
        src: 'humungousaur.png',
        scale: 1.3
    },
    {
        name: 'alienx',
        src: 'alienx.png',
        scale: 1.0
    },
    {
        name: 'heatblast',
        src: 'heatblast.png',
        scale: 1.0
    },
    {
        name: 'fourarms',
        src: 'fourarms.png',
        scale: 1.2
    },
    {
        name: 'diamondhead',
        src: 'diamondhead.png',
        scale: 1.2
    },
    {
        name: 'cannonbolt',
        src: 'cannonbolt.png',
        scale: 1.6
    },
    {
        name: 'upgrade',
        src: 'upgrade.png',
        scale: 1.4
    },
    {
        name: 'ripjaws',
        src: 'ripjaws.png',
        scale: 1.0
    },
    {
        name: 'echoecho',
        src: 'echoecho.png',
        scale: 1.0
    },
    {
        name: 'rath',
        src: 'rath.png',
        scale: 1.3
    },
    {
        name: 'spidermonkey',
        src: 'spidermonkey.png',
        scale: 1.4
    },
    {
        name: 'nrg',
        src: 'nrg.png',
        scale: 1.2
    },
    {
        name: 'nanomech',
        src: 'nanomech.png',
        scale: 1.1
    },
    {
        name: 'armadrillo',
        src: 'armadrillo.png',
        scale: 1.6
    },
    {
        name: 'waterhazard',
        src: 'waterhazard.png',
        scale: 1.0
    },
    {
        name: 'ampfibian',
        src: 'ampfibian.png',
        scale: 1.0
    },
    {
        name: 'terraspin',
        src: 'terraspin.png',
        scale: 1.6
    },
    {
        name: 'lodestar',
        src: 'lodestar.png',
        scale: 1.0
    },
    {
        name: 'ghostfreak',
        src: 'ghostfreak.png',
        scale: 0.9
    },
    {
        name: 'zsskayr',
        src: 'zsskayr.png',
        scale: 1.5
    },
    {
        name: 'eatle',
        src: 'eatle.png',
        scale: 1.2
    },
    {
        name: 'goop',
        src: 'goop.png',
        scale: 1.1
    },
    {
        name: 'juryrigg',
        src: 'juryrigg.png',
        scale: 1.1
    },
    {
        name: 'chamalien',
        src: 'chamalien.png',
        scale: 1.1
    },
    {
        name: 'fasttrack',
        src: 'fasttrack.png',
        scale: 1.0
    },
    {
        name: 'clockwork',
        src: 'clockwork.png',
        scale: 1.5
    },
    {
        name: 'brainstorm',
        src: 'brainstorm.png',
        scale: 1.7
    },
    {
        name: 'vomitman',
        src: 'vomitman.png',
        scale: 1.0
    },
    {
        name: 'wildmutt',
        src: 'wildmutt.png',
        scale: 1.6
    },
    {
        name: 'jetray',
        src: 'jetray.png',
        scale: 1.4
    },
    {
        name: 'waybig',
        src: 'waybig.png',
        scale: 1.1
    },
    {
        name: 'chromastone',
        src: 'chromastone.png',
        scale: 1.0
    }
]
const alienEl = document.getElementById("aliens");
const dial = document.querySelector(".dial");

// 1 = repouso | 2 = seleção aberta | 3 = transformado | 4 = descarregado (vermelho)
let mode = 1;
let index = 0;
const openTimers = [];

// Pré-carregar áudios para evitar atrasos
const sounds = {
    activate: new Audio("audio/activate.mp3"),
    activating: new Audio("audio/activating.mp3"),
    transformation: new Audio("audio/transformation.mp3"),
    rccw: new Audio("audio/dial_sfx_5.mp3"),
};

// Forçar carregamento dos áudios
document.addEventListener("DOMContentLoaded", function () {
    for (let key in sounds) {
        sounds[key].load();
    }
});

function playSound(sound) {
    if (sounds[sound]) {
        const audioClone = sounds[sound].cloneNode(); // Evita interrupções
        audioClone.volume = 1;
        setTimeout(() => audioClone.play().catch(() => { }), 10); // Pequeno atraso para evitar bloqueios
    }
}

document.querySelector(".alien").addEventListener("click", function () {
    console.log(`click alien, mode atual=${mode}`);
    // Já transformado: o próximo toque descarrega o Omnitrix
    if (mode == 3) {
        mode = 4;
        playSound("activate");
        document.body.classList.add("discharged");
        return;
    }

    // Descarregado: o próximo toque recarrega e volta ao modo inicial
    if (mode == 4) {
        mode = 1;
        playSound("activating");
        document.body.classList.remove("discharged");
        return;
    }

    mode = 2;
    playSound("activate");
    setTimeout(() => playSound("activating"), 50); // Pequeno atraso entre os sons
    document.querySelector(".des-lft").classList.remove("des-lft-off");
    document.querySelector(".des-rht").classList.remove("des-rht-off");
    document.querySelector(".des-lft").classList.add("des-lft-on");
    document.querySelector(".des-rht").classList.add("des-rht-on");

    openTimers.push(setTimeout(function () {
        document.querySelector(".hologram").style.display = "block";
    }, 250));
    openTimers.push(setTimeout(function () {
        alienEl.style.display = 'block';
    }, 500));
});

document.querySelector(".hologram").addEventListener("click", function () {
    mode = 3;
    // Cancela a abertura pendente para o alien não reaparecer com o mostrador fechado
    openTimers.forEach(clearTimeout);
    openTimers.length = 0;
    playSound("transformation");
    document.querySelector(".des-lft").classList.remove("des-lft-on");
    document.querySelector(".des-rht").classList.remove("des-rht-on");
    document.querySelector(".des-lft").classList.add("des-lft-off");
    document.querySelector(".des-rht").classList.add("des-rht-off");
    alienEl.style.display = 'none';
    document.querySelector(".hologram").style.display = "none";
});

document.addEventListener("keydown", function (event) {
    if (mode == 2) {
        if (event.key === "ArrowRight") {
            playSound("rccw");
            index = (index + 1) % aliens.length;
        } else if (event.key === "ArrowLeft") {
            playSound("rccw");
            index = (index - 1 + aliens.length) % aliens.length;
        }
        updateAlien();
    }
});

// Usa a rolagem da página para trocar de alien. A coroa giratória do Wear OS
// (Samsung Internet/Chrome) gera scroll de verdade na página, não "wheel" com
// deltaY — por isso comparamos a posição do scroll, não lemos event.deltaY.
// Depois de cada evento recentralizamos a rolagem para nunca bater no topo/
// fim e continuar detectando a próxima volta da coroa (ou virada do mouse).
function scrollCenter() {
    return (document.documentElement.scrollHeight - window.innerHeight) / 2;
}

let lastScrollY = scrollCenter();
window.scrollTo(0, lastScrollY);

document.addEventListener("scroll", function () {
    const diff = window.scrollY - lastScrollY;
    console.log(`scroll diff=${diff.toFixed(1)} mode=${mode}`);

    if (mode == 2 && diff !== 0) {
        playSound("rccw");
        if (diff > 0) {
            index = (index + 1) % aliens.length;
        } else {
            index = (index - 1 + aliens.length) % aliens.length;
        }
        console.log(`-> index=${index} (${aliens[index].name})`);
        updateAlien();
    }

    lastScrollY = scrollCenter();
    window.scrollTo(0, lastScrollY);
}, { passive: true });

document.addEventListener("rotarydetent", function (event) {
    if (mode == 2) {
        if (event.detail.direction === "CW") {
            playSound("rccw");
            index = (index + 1) % aliens.length;
        } else if (event.detail.direction === "CCW") {
            playSound("rccw");
            index = (index - 1 + aliens.length) % aliens.length;
        }
        updateAlien();
    }
});

let startX = 0;
let endX = 0;

function startSwipe(e) {
    startX = e.touches ? e.touches[0].clientX : e.clientX;
    handleSwipe();
}

function endSwipe(e) {
    endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
}

function handleSwipe() {
    if (mode != 2) return;
    let diffX = endX - startX;
    if (Math.abs(diffX) > 50) {
        let direction = diffX > 0 ? 1 : -1;
        playSound("rccw");
        index = (index + direction + aliens.length) % aliens.length;
        requestAnimationFrame(updateAlien);
    }
}

function updateAlien() {
    alienEl.style.display = "none";
    document.querySelector(".alien").classList.remove("alien-on");
    setTimeout(() => {
        alienEl.src = `imgs/${aliens[index].src}`;
        alienEl.style.transform = `scale(${aliens[index].scale})`;
        alienEl.style.display = "block";
        document.querySelector(".alien").classList.add("alien-on");
    }, 50);
}


// Eventos otimizados para melhor resposta
const eventTypes = ["touchstart", "touchend", "mousedown", "mouseup"];
eventTypes.forEach(event => {
    document.addEventListener(event, (event.includes("up") || event.includes('end')) ? startSwipe : endSwipe);
});
