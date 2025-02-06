let timeLeft;
let timer;
let isRunning = false;

// Função para obter os valores do formulário ou da URL
function getParams() {
	let params = new URLSearchParams(window.location.search);
	return {
		workTime: params.has("workTime") ? parseInt(params.get("workTime")) * 60 : null,
		shortBreak: params.has("shortBreak") ? parseInt(params.get("shortBreak")) * 60 : null,
		longBreak: params.has("longBreak") ? parseInt(params.get("longBreak")) * 60 : null,
		cycles: params.has("cycles") ? parseInt(params.get("cycles")) : null
	};
}

// Função para obter os valores do formulário na página principal
function getFormValues() {
	return {
		workTime: parseInt(document.getElementById("workTime").value) * 60 || 1500,
		shortBreak: parseInt(document.getElementById("shortBreak").value) * 60 || 300,
		longBreak: parseInt(document.getElementById("longBreak").value) * 60 || 900,
		cycles: parseInt(document.getElementById("cycles").value) || 4
	};
}

// Inicia o Timer (funciona tanto na página principal quanto no popup)
function startTimer() {
	if (isRunning) return; // Evita múltiplos timers rodando

	isRunning = true;

	let params = getParams();

	if (params.workTime !== null) {
		// Estamos no modo popup (parâmetros na URL)
		timeLeft = params.workTime;
	} else {
		// Estamos na página principal (pegamos valores do formulário)
		let formValues = getFormValues();
		timeLeft = formValues.workTime;
		// Mostra a seção de timer
		document.getElementById("config-form").classList.add("d-none");
		document.getElementById("timer-section").classList.remove("d-none");
	}

	updateDisplay();
	timer = setInterval(() => {
		if (timeLeft > 0) {
			timeLeft--;
			updateDisplay();
		} else {
			clearInterval(timer);
			isRunning = false;
			alert("Tempo finalizado!");
		}
	}, 1000);
}

// Atualiza o Timer na tela
function updateDisplay() {
	let minutes = Math.floor(timeLeft / 60);
	let seconds = timeLeft % 60;
	document.getElementById("timer-display").innerText = `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

// Reseta o Timer
function resetTimer() {
	clearInterval(timer);
	isRunning = false;
	let formValues = getFormValues();
	timeLeft = formValues.workTime;
	updateDisplay();
}

// Se for um popup, inicia o timer automaticamente ao carregar
window.onload = function () {
	if (window.location.search) {
		startTimer();
	}
};

// Abre o popup e passa os valores do formulário
function openPopup() {
	let formValues = getFormValues();
	let url = `popup.html?workTime=${formValues.workTime / 60}&shortBreak=${formValues.shortBreak / 60}&longBreak=${formValues.longBreak / 60}&cycles=${formValues.cycles}`;

	let popup = window.open(url, "PomodoroPopup", "width=400,height=300");

	if (!popup) {
		alert("O popup foi bloqueado pelo navegador! Permita popups para este site.");
		return;
	}

	let checkPopup = setInterval(() => {
		if (!popup || popup.closed) {
			clearInterval(checkPopup);
			alert("O popup foi fechado! Clique no botão novamente para reabrir.");
		} else {
			popup.focus();
		}
	}, 2000);
}

