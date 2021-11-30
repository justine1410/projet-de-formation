const types=["teddies","cameras","furniture"];//type des produits
const listeProduits = document.getElementById("list-produits");

 //..................texte à ajouté....................//
 function produit(choix,type){
   for(i=0; i<choix.length; i++){
     listeProduits.innerHTML = listeProduits.innerHTML+`
     <a  href="produit.html?type=${type}&id=${choix[i]._id}">
       <figure>
       <img id="imgteddy1" src=${choix[i].imageUrl} alt="teddy"/>
           <figcaption >
               <h3 id="titleteddy1">${choix[i].name}</h3>
               <p id="descriptteddy1">${choix[i].description}</p>              
           </figcaption>
       </figure>
     </a>
     `
   };
 }
 

 //.....................requête.........................//
 function request(type){
  fetch("http://localhost:3000/api/"+type)
  .then(async (response) =>{
    try{
      const resultat = await response.json();
      console.log(resultat,type)
      produit(resultat,type)
    }
    catch (e){
      console.log(e);
    }
  });
};
//...............click pour produit apparaisse...........//
function makerequest(selector, type){
  selector.addEventListener('click', function(){
    listeProduits.innerHTML= " ";
    request(type);
  })
}
makerequest(document.querySelector(".teddy"),types[0])
makerequest(document.querySelector(".cam"),types[1])
makerequest(document.querySelector(".furn"),types[2])




