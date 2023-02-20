export  default  class Input {
    constructor(
        type,
        name,
        required,
        id,
        placeholder = '',
        value
    ) {
        this.type = type;
        this.name = name;
        this.required = required;
        this.id = id;
        this.value = value;
    }
    render() {
        const formGroup = document.createElement('div');
        formGroup.classList.add('form-group', 'row');
        const label = document.createElement('label');
        label.classList.add('col-sm-2', 'col-form-label');
        label.setAttribute('for', this.id);
        label.textContent = this.name;
        this.input = document.createElement("input");
        this.input.setAttribute("type", this.type);
        this.input.setAttribute("name", this.name);
        this.input.setAttribute("required", this.required);
        this.input.setAttribute("id", this.id);
        this.input.classList.add('form-control');

        if (this.input.type === "submit") {
            this.input.setAttribute("value", "submit");
        }
        const inputWrapper = document.createElement('div');
        inputWrapper.classList.add('col-sm-10');
        inputWrapper.append(this.input);
        formGroup.append(label,inputWrapper);
        this.input.onfocus = () => {
            try {
                this.input.classList.remove('is-invalid');
                if (this.input.nextElementSibling.classList.contains('invalid-feedback')) {
                    this.input.nextElementSibling.remove()
                }
            } catch (e) {

            }
        };
        return formGroup;
    }

}

