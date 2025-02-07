let currentCycle = 0;
let isWorkPeriod = true;
let timeLeft, timer;

function startTimer() {
    // Obtendo os valores do formulário
    let workTime = parseInt(document.getElementById('workTime').value) * 60;
    let shortBreak = parseInt(document.getElementById('shortBreak').value) * 60;
    let longBreak = parseInt(document.getElementById('longBreak').value) * 60;
    let cycles = parseInt(document.getElementById('cycles').value);

    document.getElementById("config-form").classList.add("d-none");
    document.getElementById("timer-section").classList.remove("d-none");

    currentCycle = 0;
    isWorkPeriod = true;
    timeLeft = workTime;

    updateDisplay();
    timer = setInterval(() => updateTimer(workTime, shortBreak, longBreak, cycles), 1000);
}

function updateTimer(workTime, shortBreak, longBreak, cycles) {
    if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
    } else {
        switchPeriods(workTime, shortBreak, longBreak, cycles);
    }
}

function switchPeriods(workTime, shortBreak, longBreak, cycles) {
    if (isWorkPeriod) {
        currentCycle++;
        if (currentCycle % cycles === 0) {
            timeLeft = longBreak;
            document.getElementById("timer-label").innerText = "Intervalo Longo";
            document.getElementById("longBreakSound").play();
        } else {
            timeLeft = shortBreak;
            document.getElementById("timer-label").innerText = "Intervalo Curto";
            document.getElementById("shortBreakSound").play();
        }
    } else {
        if (currentCycle >= cycles) {
            document.getElementById("finishSound").play();
            resetTimer();
            return;
        }
        timeLeft = workTime;
        document.getElementById("timer-label").innerText = "Foco";
		document.getElementById("finishSound").play();
    }
    
    isWorkPeriod = !isWorkPeriod;
}

function updateDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    document.getElementById("timer-display").innerText = `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function resetTimer() {
    clearInterval(timer);
    document.getElementById("config-form").classList.remove("d-none");
    document.getElementById("timer-section").classList.add("d-none");
}