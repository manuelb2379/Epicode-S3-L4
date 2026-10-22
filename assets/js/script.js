const monthNames = [
    'Gennaio',
    'Febbraio',
    'Marzo',
    'Aprile',
    'Maggio',
    'Giugno',
    'Luglio',
    'Agosto',
    'Settembre',
    'Ottobre',
    'Novembre',
    'Dicembre',
];

const dayNames = [
    'Domenica',
    'Lunedì',
    'Martedì',
    'Mercoledì',
    'Giovedì',
    'Venerdì',
    'Sabato',
];

//FACENDO COSÌ I GIORNI ED I MESI DALL'OGGETTO DATE ARRIVANO IN NUMERO E SE LI TRASFORMO,
//LI TRASFORMA IN INGLESE MA IO LI VOGLIO IN ITALIANO.

const now = new Date();
const getYear = now.getFullYear();
const getMonth = now.getMonth();
const appointments = []; //per contenere i giorni, cioè valori che vanno da un minimo di 28 a 31


//scriviamo il nome del mese

const printCurrentMonth = () => {
    const title = document.querySelector('h1');
    const currentMonth = monthNames[getMonth];
    title.innerText = currentMonth
}

//window.onload è cosa deve stampare al caricamento della pagina
window.onload = (e) => {
    printCurrentMonth();
    createDays(dayInThisMonth());
};

//calcoliamo il numero di giorni
const dayInThisMonth = () => {
    const lastDayInMonth = new Date(getYear, getMonth + 1, 0);
    //gli sto chiedento il giorno 0 del mese successivo, pichè la data non esiste e 0 
    //è il numero che viene prima di 1, lo 0 del mese successivo sarà l'ultimo giorno del mese in corso
    const numberOfDays = lastDayInMonth.getDate();
    return numberOfDays;
}

//creiamo la griglia
const createDays = (daysNumber) => {
    const calendardiv = document.querySelector('#calendar');
    for (let i = 0; i < daysNumber; i++) {
        const dayCellDiv = document.createElement('div');
        dayCellDiv.classList.add('day');
        //le celle dovranno essere cliccabili
        dayCellDiv.addEventListener('click', function () {
            unselectAllDays(); //per deselezionare il giorno eventualmente selezionato prima
            dayCellDiv.classList.add('selected');  //quando faccio click su un giorno si deve evidenziare e quando clicco su un altro deseleziono il precendete
            changeMeetingDaySection(i);
            if (appointments[i].length > 0) {
                showAppointments(i);
            } else {
                document.querySelector('#appointments').style.display = 'none';
            }
        });

        //numero del giorno
        const cellValue = document.createElement('h3');
        const thisDate = i + 1; //perchè stiamo facendo partire i da 0 altrimenti
        if (thisDate == now.getDate()) {  //get date mi da una stringa quindi uso l'eqaulity e non strict equality perchè devo confrontare il valore visto che this date è un Number
            dayCellDiv.classList.add('currentDay');
        }
        //domenica in rosso
        let thisDay = new Date(now.getFullYear(), now.getMonth(), thisDate);
        if (thisDay.getDay() === 0) {
            cellValue.classList.add('sunday');
        }
        //nome del giorno
        let dayNumber = thisDay.getDay();
        let dayName = dayNames[dayNumber];
        cellValue.innerText = `${dayName} ${i + 1}`;
        dayCellDiv.appendChild(cellValue);
        calendardiv.appendChild(dayCellDiv);
        /*ci serve un array per ogni giorno da pushare nell'array generale
        così da poter mettere 'n' appuntamenti dentro l'array del giorno preciso*/
        appointments.push([]);
    }
}

// Pulisce la selezione precedente rimuovendo la classe 'selected' dal giorno cliccato in precedenza
const unselectAllDays = () => {
    const previousSelected = document.querySelector('.selected')
    if (previousSelected) {
        previousSelected.classList.remove('selected');
    }
}

// Aggiorna il testo e lo stile della sezione "Meeting Day" mostrando il numero del giorno selezionato
const changeMeetingDaySection = (dayNumber) => {
    const newMeetingDay = document.querySelector('#newMeetingDay');
    newMeetingDay.innerText = dayNumber + 1;
    newMeetingDay.classList.add('hasDay');
}
//inserisce gli appunamenti nella <ul> come <li> e manda a video nel caso si inserisca qualcosa
const showAppointments = (dayNumber) => {
    const dayAppointments = appointments[dayNumber];
    const appointmentsList = document.querySelector('#appointments ul');
    appointmentsList.textContent = '',
        dayAppointments.forEach((appointment) => {
            const newLi = document.createElement('li');
            newLi.innerText = appointment;
            appointmentsList.appendChild(newLi)
        });
    //lo mostro con display block solo quando ci inserisco appuntamenti
    document.querySelector('#appointments').style.display = 'block';
}//qui si ferma ciò che la pagina deve fare al caricamento

//inserimento impegni
const meetingForm = document.querySelector('form');
const selectedDay = document.querySelector('#newMeetingDay').textContent;
const timeSelect = document.querySelector('#newMeetingTime');
const inputName = document.querySelector('#newMeetingName');
const submitBtn = document.querySelector('form button')

//verifica form
timeSelect.addEventListener('blur', function (e) {
    if (timeSelect.value === '' || inputName.value === '') {
        return;
    } else {
        submitBtn.removeAttribute('disabled');
        submitBtn.classList.remove('disabled')
    }
})//serve per vedere se i due campi una volta perso il focus non hanno ''

inputName.addEventListener('blur', function (e) {
    if (timeSelect.value === '' || inputName.value === '') {
        return;
    } else {
        submitBtn.removeAttribute('disabled');
        submitBtn.classList.remove('disabled')
    }
})//stessa cosa di prima ma con l'input invece del timeSelect ''

meetingForm.addEventListener('submit', formSubmit);

function formSubmit(e) {
    e.preventDefault();
    const selectedDay = document.querySelector('#newMeetingDay').textContent;

    if (selectedDay === 'Clicca su un giorno') {
        alert('Seleziona un giorno prima di inserire l\'evento');
        meetingForm.reset();
        return;
    }//controllare che il giorno non sia vuoto altrimenti da errore 
    //esci dal submit
    //se nel form va tutto bene controlla i value e riportali 
    const meetingTime = document.querySelector('#newMeetingTime').value;
    const meetingName = document.querySelector('#newMeetingName').value;
    const meetingString = `${meetingTime} - ${meetingName}`;
    const dayIndex = Number(selectedDay) - 1; //i giorni partono da 1 ma gli indici da 0
    appointments[dayIndex].push(meetingString);
    meetingForm.reset();
    showAppointments(dayIndex);


    //pallino nei giorni con impegni
    const dot = document.createElement('span');
    dot.classList.add('dot');
    const selectedCell = document.querySelector('.selected');//verifica che la classe abbia la classe selectet
    if (!selectedCell.querySelector('dot')) {
        selectedCell.appendChild(dot);//se la classe ha il dot appendi il dot alla cella
    }
}