import modal from "./modal.js";
import token from "./login.js";
import {requests} from "./requests.js";
import {root} from "./variables.js";
import {arrayOfCards} from "./variables.js";

let cardsFromServer = [];
const cardFragment = document.querySelector(".card-template").content;
const cardTemplate = cardFragment.querySelector(".card");
const noCardsText = root.querySelector(".text-muted");

class Visit {
    constructor(cardData) {
        this.patientName = cardData["Patient Name"];
        this.visitImportance = cardData["Visit Importance"];
        this.visitDescription = cardData["Visit Description"];
        this.visitPurpose = cardData["Visit Purpose"];
        this.doctor = cardData.doctor;
        this.id = cardData.id;
        this.status = cardData.status;
        this.cardDate = cardData;
    }

    render() {
        cardsFromServer.push(this.cardDate);
        noCardsText.classList.add("text-muted--hidden");
        const card = cardTemplate.cloneNode(true);
        const cardPatientName = card.querySelector(".card__name");
        const cardDoctor = card.querySelector(".card__doctor");
        const cardPurpose = card.querySelector(".card__purpose");
        const cardImportance = card.querySelector(".card__importance");
        const cardDescription = card.querySelector(".card__description");
        const cardSelect = card.querySelector(".card__select");
        const cardEdit = card.querySelector(".card__edit");
        const select = card.querySelector(".card__select");
        cardPatientName.textContent = `Patient name: ${this.patientName}`;
        cardDoctor.textContent = `Doctor: ${this.doctor}`;
        cardPurpose.textContent = `Visit purpose: ${this.visitPurpose}`;
        cardImportance.textContent = `Importance: ${this.visitImportance}`;
        cardDescription.textContent = `Description: ${this.visitDescription}`;
        [...select.children].forEach((value) => {
            if (value.value === this.status) {
                value.setAttribute("selected", "");
                if (value.value === "OPEN") {
                    card.classList.remove("bg-grey");
                } else if (value.value === "DONE") {
                    card.classList.add("bg-grey");
                }
            } else {
                value.removeAttribute("selected");
            }
        });
        card.dataset.id = this.id;
        root.append(card);
        return {
            card: card,
            "Patient Name": cardPatientName,
            doctor: cardDoctor,
            "Visit Purpose": cardPurpose,
            "Visit Importance": cardImportance,
            "Visit Description": cardDescription,
            status: cardSelect.value,
            edit: cardEdit,
            id: this.id,
        }
    }
}

class VisitButtons {
    showMore(btn) {
        btn.classList.add("card__show-more--hidden");
        [...btn.parentElement.children].forEach((value) => {
            value.classList.remove("card__content--hidden", "card__select--hidden", "card__edit--hidden", "card__hide--hidden");
        });
    }

    hide(btn) {
        [...btn.parentElement.children].forEach((value) => {
            if (value.className.includes("card__content")) {
                value.classList.add("card__content--hidden");
            }
            if (value.className.includes("card__edit")) {
                value.classList.add("card__edit--hidden");
            }
            if (value.className.includes("card__hide")) {
                value.classList.add("card__hide--hidden");
            }
            if (value.className.includes("card__select")) {
                value.classList.add("card__select--hidden");
            }
            if (value.className.includes("card__show-more")) {
                value.classList.remove("card__show-more--hidden");
            }
        });
    }

    delete(btn) {
        const card = btn.parentElement.parentElement;
        const cardIdEl = card.dataset.id;
        (async () => {
            try {
                await requests.request("DELETE", token, cardIdEl, null);
                card.remove();
                if (root.children.length <= 1) {
                    noCardsText.classList.remove("text-muted--hidden");
                }
                cardsFromServer = cardsFromServer.filter((value) => +value.id !== +cardIdEl);
            } catch (e) {
                alert(`try again later, ${e.message}`)
            }
            arrayOfCards.forEach(({cardId}, index) => {
                if (+cardId === +cardIdEl) {
                    arrayOfCards.splice(index, 1);
                }
            })
        })();
    }

    statusChange(select) {
        (async () => {
            try {
                const selectValue = select.value;
                const currentCard = select.parentElement;
                const currentCardId = currentCard.dataset.id;
                const cardObj = cardsFromServer.find(({id}) => +id === +currentCardId);
                cardObj.status = selectValue;
                await requests.request("PUT", token, currentCardId, JSON.stringify(cardObj));
                arrayOfCards.forEach((value) => {
                    if (value.card === currentCard) {
                        value.status = selectValue;
                    }
                })
                if (selectValue === "DONE") {
                    currentCard.classList.add("bg-grey");
                } else if (selectValue === "OPEN") {
                    currentCard.classList.remove("bg-grey");
                }
            } catch (e) {
                console.log(e.message);
                alert("Try again later");
            }
        })()
    }
}

export class VisitCardiologist extends Visit {
    constructor(cardData) {
        super(cardData);
        this.age = cardData["Age"];
        this.bloodPressure = cardData["Blood Pressure"];
        this.listOfDiseases = cardData["List of Diseases"];
        this.massBodyIndex = cardData["Mass Body Index"];
        this.id = cardData.id;
    }

    renderCardiologist() {
        const cardFields = super.render();
        const cardAge = document.createElement("p");
        const cardListOfDiseases = document.createElement("p");
        const cardMassBodyIndex = document.createElement("p");
        const cardBloodPressure = document.createElement("p");
        cardAge.classList.add("card__age", "card__content", "card__content--hidden", "card-text", "mb-3");
        cardListOfDiseases.classList.add("card__list-of-diseases", "card__content", "card__content--hidden", "card-text", "mb-3");
        cardMassBodyIndex.classList.add("card__mass-body-index", "card__content", "card__content--hidden", "card-text", "mb-3");
        cardBloodPressure.classList.add("card__blood-pressure", "card__content", "card__content--hidden", "card-text");
        cardAge.textContent = `Age: ${this.age}`;
        cardListOfDiseases.textContent = `Diseases: ${this.listOfDiseases}`;
        cardMassBodyIndex.textContent = `Mass body index: ${this.massBodyIndex}`;
        cardBloodPressure.textContent = `Blood pressure: ${this.bloodPressure}`;
        cardFields.edit.before(cardAge, cardListOfDiseases, cardMassBodyIndex, cardBloodPressure);
        cardFields.Age = cardAge;
        cardFields["List of Diseases"] = cardListOfDiseases;
        cardFields["Mass Body Index"] = cardMassBodyIndex;
        cardFields["Blood Pressure"] = cardBloodPressure;
        return cardFields;
    }
}

export class VisitDentist extends Visit {
    constructor(cardData) {
        super(cardData);
        this.dateOfLastVisit = cardData["Date of last visit"];
    }

    renderDentist() {
        const cardFields = super.render();
        const cardDateOfLastVisit = document.createElement("p");
        cardDateOfLastVisit.classList.add("card__date-of-last-visit", "card__content", "card__content--hidden", "card-text", "mb-3");
        cardDateOfLastVisit.textContent = `Date of last visit: ${this.dateOfLastVisit}`;
        cardFields.edit.before(cardDateOfLastVisit);
        cardFields["Date of last visit"] = cardDateOfLastVisit
        return cardFields;
    }
}

export class VisitTherapist extends Visit {
    constructor(cardData) {
        super(cardData);
        this.age = cardData["Age"];
    }

    renderTherapist() {
        const cardFields = super.render();
        const cardAge = document.createElement("p");
        cardAge.classList.add("card__age", "card__content", "card__content--hidden", "card-text", "mb-3");
        cardAge.textContent = `Age: ${this.age}`;
        cardFields.edit.before(cardAge);
        cardFields.Age = cardAge;
        return cardFields;
    }
}

export async function renderCards(token) {
    try {
        const getData = await requests.request("GET", token, "", null);
        arrayOfCards.forEach(value => value.card.remove());
        arrayOfCards.splice(0);
        getData.forEach((value) => {
            let card;
            switch (value.doctor) {
                case 'Cardiologist':
                    card = new VisitCardiologist(value).renderCardiologist();
                    break;
                case 'Dentist':
                    card = new VisitDentist(value).renderDentist();
                    break;
                case 'Therapist':
                    card = new VisitTherapist(value).renderTherapist();
                    break;
            }
            if (card) {
                arrayOfCards.push(card);
            }
        })
    } catch (e) {
        console.log(e.message);
        alert("Something went wrong..");
    }
}

const visitButtons = new VisitButtons();
root.addEventListener("click", (e) => {
    if (e.target.closest(".card__show-more")) {
        visitButtons.showMore(e.target);
    }
    if (e.target.closest(".card__hide")) {
        visitButtons.hide(e.target);
    }
    if (e.target.closest(".btn-close")) {
        visitButtons.delete(e.target);
    }
    if (e.target.closest(".card__edit")) {
        modal.edit(e.target.parentElement);
    }
})
root.addEventListener("change", (e) => {
    if (e.target.closest(".card__select")) {
        visitButtons.statusChange(e.target)
    }
})

