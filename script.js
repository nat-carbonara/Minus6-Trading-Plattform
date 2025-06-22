let prezzo = 100.0;
let saldo = 1000.0;
let azioni_possedute = 0;
let investito = 0;
let inTrade = false;
let tempo = [0];
let prezzi = [prezzo];
let indexTempo = 1;
let forzaDirezionale = 0;

const saldoElem = document.getElementById("saldo");
const guadagnoElem = document.getElementById("guadagno");
const inputInvesti = document.getElementById("investi");
const ctx = document.getElementById("chart").getContext("2d");

const chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: tempo,
    datasets: [{
      label: "Prezzo",
      data: prezzi,
      borderColor: 'blue',
      borderWidth: 2,
      fill: false
    }]
  },
  options: {
    animation: false,
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "Tempo"
        }
      },
      y: {
        title: {
          display: true,
          text: "Prezzo"
        }
      }
    },
    plugins: {
      title: {
        display: true,
        text: `Prezzo Attuale: €${prezzo.toFixed(2)}`
      }
    }
  }
});

function aggiornaPrezzo() {
  let variazione = (Math.random() * 2 - 1);
  if (forzaDirezionale === 1) {
    variazione = Math.abs(variazione) + Math.random() * 0.5;
  } else if (forzaDirezionale === -1) {
    variazione = -Math.abs(variazione) - Math.random() * 0.5;
  }
  forzaDirezionale = 0;

  prezzo = Math.max(1, prezzo + variazione);
  tempo.push(indexTempo++);
  prezzi.push(prezzo);

  chart.data.labels = tempo;
  chart.data.datasets[0].data = prezzi;
  chart.options.plugins.title.text = `Prezzo Attuale: €${prezzo.toFixed(2)}`;
  chart.update();

  if (inTrade) {
    const valoreAttuale = azioni_possedute * prezzo;
    const profitto = valoreAttuale - investito;
    guadagnoElem.textContent = `Guadagno: €${profitto.toFixed(2)}`;
    guadagnoElem.style.color = profitto >= 0 ? "green" : "red";
  }

  setTimeout(aggiornaPrezzo, 500);
}

function buy() {
  if (inTrade) {
    alert("Hai già acquistato.");
    return;
  }
  const amount = parseFloat(inputInvesti.value);
  if (isNaN(amount) || amount <= 0) {
    alert("Inserisci un numero valido.");
    return;
  }
  if (amount > saldo) {
    alert("Fondi insufficienti.");
    return;
  }

  azioni_possedute = amount / prezzo;
  investito = amount;
  saldo -= amount;
  inTrade = true;
  saldoElem.textContent = `Saldo: €${saldo.toFixed(2)}`;
}

function sell() {
  if (!inTrade) {
    alert("Devi prima acquistare.");
    return;
  }

  const valoreAttuale = azioni_possedute * prezzo;
  const profitto = valoreAttuale - investito;
  saldo += valoreAttuale;
  azioni_possedute = 0;
  investito = 0;
  inTrade = false;
  saldoElem.textContent = `Saldo: €${saldo.toFixed(2)}`;
  guadagnoElem.textContent = `Guadagno: €${profitto.toFixed(2)}`;
  guadagnoElem.style.color = profitto >= 0 ? "green" : "red";
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") forzaDirezionale = 1;
  if (e.key === "ArrowDown") forzaDirezionale = -1;
});

aggiornaPrezzo();
