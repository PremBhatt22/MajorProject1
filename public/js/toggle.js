let taxBtn = document.getElementById("flexSwitchCheckDefault");
console.log("here")
taxBtn.addEventListener("click", ()=> {
    console.log("Clicked");
    let taxPrice = document.getElementsByClassName("tax-info");
    
    console.log(taxPrice);
    for(info of taxPrice) {
        info.classList.toggle("hidden");
    }
});