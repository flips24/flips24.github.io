// Tab navigation horizontal scroll buttons
// const btnLeft = document.querySelector(".left-btn");
// const btnRight = document.querySelector(".right-btn");
const tabMenu = document.querySelector(".tab-menu");


// Untuk swaping
let pageWidth = window.innerWidth || document.body.clientWidth;
let treshold = Math.max(1,Math.floor(0.01 * (pageWidth)));
let touchstartX = 0;
let touchstartY = 0;
let touchendX = 0;
let touchendY = 0;

const limit = Math.tan(45 * 1.5 / 180 * Math.PI);

tabMenu.addEventListener('touchstart', function(event) {
    touchstartX = event.changedTouches[0].screenX;
    touchstartY = event.changedTouches[0].screenY;
}, false);

tabMenu.addEventListener('touchend', function(event) {
    touchendX = event.changedTouches[0].screenX;
    touchendY = event.changedTouches[0].screenY;
    handleGesture(event);
}, false);

function handleGesture(e) {
    let x = touchendX - touchstartX;
    let y = touchendY - touchstartY;
    let xy = Math.abs(x / y);
    let yx = Math.abs(y / x);
    if (Math.abs(x) > treshold || Math.abs(y) > treshold) {
        if (yx <= limit) {
            if (x < 0) {
                alert("left");
            } else {
                alert("right");
            }
        }
        if (xy <= limit) {
            if (y < 0) {
                console.log("top");
            } else {
                console.log("bottom");
            }
        }
    } else {
        console.log("tap");
    }
}


// const iconVisibility = () => {
//     let scrollLeftValue = Math.ceil(tabMenu.scrollLeft);
//     let scrollableWidth = tabMenu.scrollWidth - tabMenu.clientWidth;

//     btnLeft.style.display = scrollLeftValue > 0 ? "block" : "none";
//     btnRight.style.display = scrollableWidth > scrollLeftValue ? "block" : "none";
// }

// btnRight.addEventListener("click", () => {
//     tabMenu.scrollLeft += 150;
//     setTimeout(() => iconVisibility(), 50);
// });
// btnLeft.addEventListener("click", () => {
//     tabMenu.scrollLeft -= 150;
//     setTimeout(() => iconVisibility(), 50);
// });

// window.onload = function() {
//     btnRight.style.display = tabMenu.scrollWidth > tabMenu.clientWidth || tabMenu.scrollWidth >= window.innerWidth ? "block" : "none";
//     btnLeft.style.display = tabMenu.scrollWidth >= window.innerWidth ? "" : "none";
// }
// window.onresize = function() {
//     btnRight.style.display = (tabMenu.scrollWidth > tabMenu.clientWidth) || (tabMenu.scrollWidth >= window.innerWidth) ? "block" : "none";
//     btnLeft.style.display = tabMenu.scrollWidth >= window.innerWidth ? "" : "none";

//     let scrollLeftValue = Math.round(tabMenu.scrollLeft);

//     btnLeft.style.display = scrollLeftValue > 0 ? "block" : "none";
// }

// // Draggable navigation
// let activeDrag = false;

// tabMenu.addEventListener("mousemove", (drag) => {
//     // console.log(drag.movementX)
//     if(!activeDrag) return;
//     tabMenu.scrollLeft -= drag.movementX;
//     // iconVisibility();
//     tabMenu.classList.add("dragging");
// });

// document.addEventListener("mouseup", () => {
//     activeDrag = false;
//     tabMenu.classList.remove("dragging");
// });

// tabMenu.addEventListener("mousedown", () => {
//     activeDrag = true;
// });