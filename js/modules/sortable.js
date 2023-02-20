import {root} from "./variables.js";

const sortable = new Sortable(root, {
    swapThreshold: 1,
    animation: 200,
    ghostClass: "blue-background-class"
});

export default sortable;