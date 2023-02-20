import Input from "./input.js";
import {requests} from "./requests.js";
import token from "./login.js";
import {arrayOfCards} from "./variables.js";
import {VisitCardiologist, VisitDentist, VisitTherapist } from "./visit.js";

class Modal {
    constructor(modalWindow) {
        this.modalWindow = modalWindow;
    }

    open(purpose) {
        this.modalWindow.style.display = 'block';
        this.root = this.modalWindow.querySelector('.modal-window__content-wrapper');
        const selectDoctor = this.modalWindow.querySelector('#selectDoctor');
        selectDoctor.firstElementChild.selected = true;
        (purpose === 'create') ? selectDoctor.classList.remove('d-none') : selectDoctor.classList.add('d-none');
    }

    close() {
        try {
            this.form.remove()
        } catch (e) {
        }
        this.modalWindow.style.display = 'none'
    }

    renderForm(doctor) {
        try {
            document.getElementById('visit-form').remove()
        } catch (e) {
        }
        const template = document.querySelector('.form-template').content;
        this.form = template.querySelector('form').cloneNode(true);
        const formFooter = this.form.querySelector('.modal-footer'),
            closeFormBtn = this.form.querySelector('#closeForm');
        const visitPurpose = new Input('text','Visit Purpose', true, 'purpose', '').render();
        const visitDescription = new Input('text', "Visit Description", true, "visitDescription", '').render();
        const patientName = new Input('text', "Patient Name", true, "visitPatient", true).render();
        formFooter.before(visitPurpose,visitDescription, patientName);
        this.doctor = doctor;
        let age;
        switch (this.doctor) {
            case 'Cardiologist':
                const bloodPressure = new Input('text', 'Blood Pressure', true, 'bloodPressure', ' ', 'Error').render();
                bloodPressure.onkeyup = (event) => {
                    if (event.target.value.length === 3 && Number.isInteger(+event.target.value[2])){
                        event.target.value += '/';
                    }
                }
                const massBodyIndex = new Input('text', 'Mass Body Index', true, 'massBodyIndex', '', 'Error').render();
                const listOfDiseases = new Input('text', 'List of Diseases', true, 'listOfDiseases', '', 'Error').render();
                age = new Input('text', 'Age', true, 'age', '', 'Error').render();
                formFooter.before(bloodPressure, massBodyIndex, listOfDiseases, age);
                break;
            case 'Dentist':
                const dateOfLastVisit = new Input('date', 'Date of last visit', true, 'dateOfLastVisit', '', 'Error').render();
                formFooter.before(dateOfLastVisit);
                break;
            case 'Therapist':
                age = new Input('text', 'Age', true, 'age', '', 'Error').render();
                formFooter.before(age);
                break;
        }
        closeFormBtn.onclick = () => {
            this.close();
        }
        this.root.append(this.form);
        return this.form;
    }

    submit() {
        const submitForm = async (event) => {
            event.preventDefault();
            const invalidFeedbacks = document.querySelectorAll('.invalid-feedback');
            invalidFeedbacks.forEach(value => value.remove());
            const form = event.target;
            const formElements = this.checkForm(form);
            if (formElements){
                const data = Object.fromEntries(formElements.map(input => [input.name, input.value]));
                data.doctor = this.doctor;
                data.status = 'OPEN';
                const json = JSON.stringify(data);
                try {
                    const request = requests.request('POST', token, '', json);
                    const cardData = await request;
                    let card;
                    switch (this.doctor) {
                        case 'Cardiologist':
                            card = new VisitCardiologist(cardData).renderCardiologist();
                            break;
                        case 'Dentist':
                            card = new VisitDentist(cardData).renderDentist();
                            break;
                        case 'Therapist':
                            card = new VisitTherapist(cardData).renderTherapist();
                            break;
                    }
                    arrayOfCards.push(card);
                    this.close();
                } catch (e) {
                    alert('Server returned error, try to create card again!')
                }
            }

        }
        this.form.addEventListener('submit', submitForm);
    }

    async edit(card) {
        this.open('edit');
        const id = card.dataset.id;
        const cardData = arrayOfCards.find(value => value.card === card);
        const doctor = cardData.doctor.textContent.split(':')[1].trim();
        const form = this.renderForm(doctor);
        const formElements = [...form.elements].filter(({type}) => (type !== 'submit' && type !== 'button'));
        formElements.forEach(input => {
            input.value = cardData[input.name].textContent.split(':')[1].trim();
        });
        form.onsubmit = async (event) => {
            event.preventDefault();
            const invalidFeedbacks = document.querySelectorAll('.invalid-feedback');
            invalidFeedbacks.forEach(value => value.remove());
            const newFormElements = this.checkForm(form);
            if (newFormElements) {
                const data = Object.fromEntries(newFormElements.map(input => [input.name, input.value]));
                data.doctor = doctor;
                data.status = cardData.status;
                const json = JSON.stringify(data);
                try {
                    const requestEdit = requests.request('PUT', token, id, json);
                    const editedCardData = await requestEdit;
                    for (let key in editedCardData) {
                        if (key === 'id' || key === 'doctor' || key === 'status') {
                            continue
                        }
                        cardData[key].textContent = cardData[key].textContent.split(':')[0] + ': ' + editedCardData[key];
                    }
                    this.close();
                } catch (e) {
                    alert('Server responded mistake, Please try again')
                }
            }
        }
    }
    checkForm (form) {
        const formElements = [...form.elements].filter(({type}) => (type !== 'submit' && type !== 'button'));
        let check = formElements.length;
        formElements.forEach(input => {
            if (!input.value.trim()){
                createInvalidFeedback(input, 'Fill out this input');
                check--;
            }
            if (input.value.length > 450){
                createInvalidFeedback(input, 'Max 450 symbols');
                check--;
            }
            if (input.name === 'Patient Name' && !input.value.match(/^[a-zа-я\s]{3,25}$/i)){
                createInvalidFeedback(input, 'Please provide a Patient Name');
                check--;
            }
            if (input.name === 'Visit Purpose' && input.value.length < 3){
                createInvalidFeedback(input, 'Please provide all details of the visit');
                check--;
            }
            if ((input.name === 'Age' || input.name === 'Mass Body Index') && (!Number.isInteger(+input.value) || (input.value > 100 || input.value < 1))){
                createInvalidFeedback(input, 'Please provide a Patient Age');
                check--;
            }

            if (input.name === 'Date of last visit'){
                const date = new Date(input.value),
                    now = new Date();
                if (now < date) {
                    createInvalidFeedback(input, 'Date must be in the past');
                    check--;
                }
            }
            if (input.name === 'Blood Pressure'){
                if (!input.value.match(/^[0-9]{2,3}\/[0-9]{2,3}$/)){
                    createInvalidFeedback(input, 'Please provide a real blood pressure!');
                    check--;
                } else {
                    const systolic = +input.value.split('/')[0];
                    const diastolic = +input.value.split('/')[1];
                    if (systolic < 30 || systolic > 230 || diastolic < 30 || diastolic > 230 || systolic < diastolic){
                        createInvalidFeedback(input, 'Please provide a real blood pressure!');
                        check--;
                    }
                }
            }
        })
        function createInvalidFeedback(input, errorText){
            input.classList.add('is-invalid');
            const invalidFeedback = document.createElement('div');
            invalidFeedback.classList.add('invalid-feedback');
            invalidFeedback.textContent = errorText;
            input.after(invalidFeedback);
        }
        return (check === formElements.length) ?  formElements : false;
    }
}
const modal = new Modal(document.getElementById('modalVisit'));
const addVisitBtn = document.getElementById('create-btn');
const closeModalVisitWindowBtn = document.getElementById('closeBtn');
const selectDoctor = document.getElementById('selectDoctor');


addVisitBtn.onclick = () => modal.open('create');
closeModalVisitWindowBtn.onclick = () => modal.close();

selectDoctor.onchange = async (event) => {
    modal.renderForm(event.target.value);
    modal.submit();
}
window.addEventListener('click', (event)=> {
    if (event.target.id === 'modalVisit'){
        modal.close();
    }
})

export default modal;

