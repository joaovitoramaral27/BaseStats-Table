const inputs = document.querySelectorAll(".stat-input");
const bars = document.querySelectorAll(".bar");
const totalElement = document.getElementById("total");


function interpolateColor(color1, color2, factor) {

    const r = Math.round(
        color1[0] + (color2[0] - color1[0]) * factor
    );

    const g = Math.round(
        color1[1] + (color2[1] - color1[1]) * factor
    );

    const b = Math.round(
        color1[2] + (color2[2] - color1[2]) * factor
    );

    return `rgb(${r}, ${g}, ${b})`;
}

function getStatColor(value) {

    const vermelho = [255, 0, 0];
    const laranja = [255, 128, 0];
    const amarelo = [255, 220, 0];
    const verdeClaro = [173, 255, 47];
    const verdeEscuro = [0, 128, 0];
    const ciano = [0, 255, 255];

    function lateTransition(value, start, end, transitionSize) {

        const transitionStart = end - transitionSize;

        if (value < transitionStart) {
            return 0;
        }

        let factor =
            (value - transitionStart) /
            (end - transitionStart);

        factor = Math.max(0, Math.min(1, factor));

        factor = factor * factor * (3 - 2 * factor);

        return factor;
    }


    if (value < 50) {

        const factor = lateTransition(
            value,
            0,
            49,
            10
        );

        return interpolateColor(
            vermelho,
            laranja,
            factor
        );
    }


    if (value < 80) {

        const factor = lateTransition(
            value,
            50,
            79,
            7
        );

        return interpolateColor(
            laranja,
            amarelo,
            factor
        );
    }


    if (value < 100) {

        const factor = lateTransition(
            value,
            80,
            99,
            5
        );

        return interpolateColor(
            amarelo,
            verdeClaro,
            factor
        );
    }


    if (value < 130) {

        const factor = lateTransition(
            value,
            100,
            129,
            7
        );

        return interpolateColor(
            verdeClaro,
            verdeEscuro,
            factor
        );
    }


    if (value < 170) {

        const factor = lateTransition(
            value,
            130,
            169,
            10
        );

        return interpolateColor(
            verdeEscuro,
            ciano,
            factor
        );
    }


    return `rgb(
        ${ciano[0]},
        ${ciano[1]},
        ${ciano[2]}
    )`;
}


function updateStats() {

    let total = 0;

    inputs.forEach((input, index) => {

        let value = Number(input.value);

        if (value < 0) {
            value = 0;
            input.value = 0;
        }

        if (value > 255) {
            value = 255;
            input.value = 255;
        }

        total += value;

        const percentage = (value / 255) * 100;

        bars[index].style.width =
            percentage + "%";

        bars[index].style.backgroundColor =
            getStatColor(value);
    });

    totalElement.textContent = total;
}


inputs.forEach(input => {
    input.addEventListener(
        "input",
        updateStats
    );
});


updateStats();


async function downloadStats() {
    const element = document.getElementById("stats-box");
    const tableName = document.getElementById("table-name").value.trim();

    // Usa o nome digitado ou um nome padrão caso o input esteja vazio
    const fileName = tableName || "Stats-Table";

    const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#f0f0f0"
    });

    const link = document.createElement("a");

    link.download = `${fileName}.png`;
    link.href = canvas.toDataURL("image/png");

    link.click();
}