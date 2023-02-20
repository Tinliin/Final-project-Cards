import { root } from "./variables.js";
import { arrayOfCards } from "./variables.js";

class Filter {
  constructor(root, arrayOfCards) {
    this.root = root;
    this.arrayOfCards = arrayOfCards;
    this.titleFilterValue = "empty string";
    this.statusFilterValue = "All";
    this.importanceFilter = "All";
  }

  filterLisners() {
    const titleFilter = document.querySelector("#floatingSearchTitle");
    titleFilter.addEventListener("input", (e) => {
      this.titleFilterValue = e.target.value;
      this.hideNshow();
    });
    const statusFilter = document.querySelector("#status");
    statusFilter.addEventListener("change", (e) => {
      this.statusFilterValue = e.target.value;
      this.hideNshow();
    });
    const importanceFilter = document.querySelector("#importance");
    importanceFilter.addEventListener("change", (e) => {
      this.importanceFilter = e.target.value;
      this.hideNshow();
    });
    const showAll = document.querySelector("#show-all");
    showAll.addEventListener("click", () => {
      arrayOfCards.forEach((e) => {
        e.card.style.display = "flex";
      });
      document.querySelector("#status").options[0].selected = "All";
      document.querySelector("#importance").options[0].selected = "All";
      document.querySelector("#floatingSearchTitle").value = "";
      this.titleFilterValue = "empty string";
      this.statusFilterValue = "All";
      this.importanceFilter = "All";
    });
  }
  hideNshow() {
    arrayOfCards.forEach((e) => {
      if ((e["Visit Purpose"].innerText
          .toLowerCase()
          .includes(this.titleFilterValue.toLowerCase()) 
          ||
        e["Visit Description"].innerText
          .toLowerCase()
          .includes(this.titleFilterValue.toLowerCase())
          ||
          this.titleFilterValue.toLowerCase() === "empty string")
          &&
          (e.status.toLowerCase() === this.statusFilterValue.toLowerCase() ||
          this.statusFilterValue.toLowerCase() == "all")
          &&
          (e["Visit Importance"].innerText.toLowerCase().split(" ")[1] === this.importanceFilter.toLowerCase()
          || this.importanceFilter == "All")
      ) {
        root.querySelector(`[data-id="${e.card.dataset.id}"]`).style.display =
          "flex";
      } 
      else {
        root.querySelector(`[data-id="${e.card.dataset.id}"]`).style.display =
          "none";
      };
    });
  }
}
export const filter = new Filter(root, arrayOfCards).filterLisners();
