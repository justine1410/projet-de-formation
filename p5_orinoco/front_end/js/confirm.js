
let valideTeddy = JSON.parse(localStorage.getItem("valideTeddy"));
let valideCam = JSON.parse(localStorage.getItem("valideCam"));
let valideFurn = JSON.parse(localStorage.getItem("valideFurn"));
let contact = JSON.parse(localStorage.getItem("contact"));
let produit = JSON.parse(localStorage.getItem("produit"));

//--------------message de validation------------------//
let merci = document.querySelector('.confirmation');
 merci.innerHTML = `           
 <h2>Votre commande a bien été validée. </h2><br/>
 <p>${contact.firstName+" "+contact.lastName}, votre commande  sera bientôt envoyée</p>
 <p>Un mail vous sera envoyé à votre adresse mail : ${contact.email}.</p>
 <p>Nous vous remercions pour votre confiance</p>
 <p>À bientôt</p>
`;


//----------------recapitulation de la commande---------------//
if(valideTeddy !== null){
    let numCommande = document.querySelector('.num-commandeTeddy');
    numCommande.innerHTML=`
    Votre commande d'ours en peluche porte le numero de commande <br/> ${valideTeddy.orderId} <br/>
    `;    
}
if(valideCam !== null){
    let numCommande = document.querySelector('.num-commandeCam');
    numCommande.innerHTML=`
    Votre commande  d'appareil photos porte le numero de commande <br/> ${valideCam.orderId} <br/>
    `;    
}
if(valideFurn !== null){
    let numCommande = document.querySelector('.num-commandeFurn');
    numCommande.innerHTML=`
    Votre commande  de meuble porte le numero de commande <br/> ${valideFurn.orderId} <br/>
    `;    
}



let validation = produit;
total = 0;
validation.forEach(function(e){
    function produitcommander(type){
        document.getElementById("recap"+type).insertAdjacentHTML("beforeend",`
        <div class="produit">
            <img src=${e.image} alt="teddy.1"/>
            <h3 >${e.name}</h3>
            <p>qte : ${e.quantite}</p>
            <p >${e.prix}€</p>
        </div>
        `
        );

    }

    if(e.type == "teddies"){
        produitcommander("Teddy")
    }else if(e.type == "cameras"){
        produitcommander("Cam")
    }else if(e.type == "furniture"){
        produitcommander("Furn")
    }

    total = total + e.prix * e.quantite;
    document.getElementById("total").innerHTML = total+ "€";
});


//retour a l'acceuil
let acceuil = document.querySelector(".acceuil")
console.log(acceuil);
acceuil.addEventListener("click", function(e){
    e.preventDefault
    localStorage.clear();

});

