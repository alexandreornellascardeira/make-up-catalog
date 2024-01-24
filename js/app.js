/*
RESPONSÁVEL     SOLICITANTE     DATA/HORA         INDICE        COMENTÁRIOS
===========     ===========     ================  ============  ===================================================
ORNELLAS        BATEIXEIRA      19/01/2024 07:54                Construção de uma aplicação de catálogo de produtos 
                                                                de maquiagem a ser consumido de uma API utilizando
                                                                JavaScript puro e HTML.
*/
//URL da API...
const URL_SERVER = "http://makeup-api.herokuapp.com/api/v1/";

const FATOR_CONVERSAO_MOEDA = 5.5;

//Lista com informações dos produtos...
let arrayCatalog = [];
let arrayProducts = [];
const arrayBrands = [];
const arrayTypes = [];


//Exibe mensagens de andamento ( para fins de depuração ...)
function andamento(msg, tpOK) {

  let msgAndamento = document.querySelector("#msgAndamento");

  if (msgAndamento) {

    if (msg == undefined || msg === "") {

      msgAndamento.textContent = "";
      msgAndamento.style.display = 'none';
      return;
    };

    if (tpOK == 0) {
      msgAndamento.style.color = 'red';
    } else {
      msgAndamento.style.color = 'green';
    }

    msgAndamento.textContent = msg;
  }

}

// Carrega filtro de marcas e tipos de produtos na UI...
function fillFilters() {

  // Filtro de marcas...
  const selectBrands = document.getElementById("filter-brand");

  selectBrands.innerHTML = '';

  //Adiciona opção "Todos"...
  const optionBrandTodos = document.createElement('option');

  optionBrandTodos.value = "";
  optionBrandTodos.text = "Todos";

  selectBrands.appendChild(optionBrandTodos);

  arrayBrands.sort().forEach(brand => {
    const optionElement = document.createElement('option');
    optionElement.value = brand;
    optionElement.text = brand;
    selectBrands.appendChild(optionElement);
  });


  // Filtro de tipos de produtos...
  const selectTypes = document.getElementById("filter-type");

  selectTypes.innerHTML = '';

  const optionTypesTodos = document.createElement('option');

  optionTypesTodos.value = "";
  optionTypesTodos.text = "Todos";

  selectTypes.appendChild(optionTypesTodos);

  arrayTypes.sort().forEach(type => {
    const optionElement = document.createElement('option');
    optionElement.value = type;
    optionElement.text = type;
    selectTypes.appendChild(optionElement);
  });



}

//Carrega cartões de produtos na UI...
function loadCatalog(data) {

  //Permite aplicar filtros...
  arrayProducts = data;

  //Adiciona o cartão na UI...
  const catalogSection = document.querySelector("#catalogSection");

  //Limpa itens atual...
  catalogSection.innerHTML = '';

  if (data.length == 0) {
    andamento("Produto não encontrado.", 0);
    return;
  }

  let indice = 0;

  data.forEach(product => {

    //Produtos sem avaliação...
    if (product.rating == null) {
      product.rating = 0;
    }

    // Add the brand to the brands array if not already present
    if (!arrayBrands.includes(product.brand)) {
      arrayBrands.push(product.brand);
    }

    // Add the type to the types array if not already present
    if (!arrayTypes.includes(product.product_type)) {
      arrayTypes.push(product.product_type);
    }

    // Cria o cartão do produto...
    const card = productItem(product, indice++);

    // Evento para exibir os detalhes do produto...
    //card.addEventListener('click', () => openModal(product));


    // Cria um elemento HTML através de uma string...
    const tempContainer = document.createElement('p');

    tempContainer.innerHTML = card;

    // Obtem o DIV... 
    const divElement = tempContainer.firstChild;


    catalogSection.appendChild(divElement);



  });


}


//Aplicar filtros...

function doFilterBrand(inArray, brand) {

  if (brand !== "") return inArray.filter(product => product.brand === brand);

  return inArray;
}

function doFilterType(inArray, productType) {

  if (productType !== "") return inArray.filter(product => product.product_type === productType);

  return inArray;
}

function doFilterName(inArray, name) {

  if (name !== "") return inArray.filter(product => product.name.toLowerCase().includes(name.toLowerCase()));

  return inArray;
}

//Aplicar ordenação...

function doSortAZ(inArray, apply) {

  if (apply)

    //Ordem ascendente por nome...
    return inArray.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });

  return inArray;
}

function doSortZA(inArray, apply) {

  if (apply)

    //Ordem descendente por nome...
    return inArray.sort(function (a, b) {
      return b.name.localeCompare(a.name);
    });

  return inArray;

}

function doSortRating(inArray, apply) {

  if (apply)

    // Ordernar por rating descrescente...
    return inArray.sort(function (a, b) {
      return b.rating - a.rating;
    });


  return inArray;

}

function doSortLowerPrice(inArray, apply) {

  if (apply)

    // Ordernar por preço...
    return inArray.sort(function (a, b) {
      return a.price - b.price;
    });


  return inArray;

}

function doSortHighPrice(inArray, apply) {

  if (apply)

    // Ordernar por preço decrescente...
    return inArray.sort(function (a, b) {
      return b.price - a.price;
    });


  return inArray;

}
function doSort(inArray, sortType) {

  let sortArray = [];

  sortArray = doSortZA(inArray, sortType === "Z-A");

  sortArray = doSortAZ(sortArray, sortType === "A-Z");

  sortArray = doSortHighPrice(sortArray, sortType === "Maiores Preços");

  sortArray = doSortLowerPrice(sortArray, sortType === "Menores Preços");

  sortArray = doSortRating(sortArray, sortType === "Melhor Avaliados");


  return sortArray;
  
  /*Not working...
  return
  doSortHighPrice(
    doSortLowerPrice(
      doSortRating(
        doSortZA(
          doSortAZ(inArray, sortType === "A-Z"),
          sortType === "Z-A"),
        sortType === "Melhor Avaliados"),
      sortType === "Menores Preços"),
    sortType === "Maiores Preços");
*/


}

function doFilter(brand, productType, name, sortType) {

  loadCatalog(
    doSort(doFilterName(doFilterType(doFilterBrand(arrayCatalog, brand), productType), name), sortType)
  );

}

//Carrega catalogo...
function setCatalog(data) {

  arrayCatalog = data;

  //Exibe dados...
  loadCatalog(data);

  //Carrega opções dos filtros...

  fillFilters();

  andamento("", 1);

}

// Exibir os detalhes do produto em uma janela modal...
function showDetails(indice) {

  const divElem = document.querySelector(`#details_${indice}`);

  // Carrega detalhes do produto...
  divElem.innerHTML = loadDetails(indice);

}


//Retorna catálogo a ser apresentando na tela inicial...
function getCatalog() {


  andamento("Carregando catálogo...", 1);

  //Efetua o GET dos produtos...

  fetch(`${URL_SERVER}products.json`, {
    method: 'get',
  })
    .then(function (response) {
      return response.text()
    }).then(function (text) {
      setCatalog(JSON.parse(text));
    }).catch(err => andamento(err, 0));


}

//Convert o valor do produto em reais...
function getAdjustedPrice(price) {

  // Cálculo do preço final...
  const finalPrice = price * FATOR_CONVERSAO_MOEDA;

  // Apresenta o valor com duas casas decimais...
  return parseFloat(finalPrice).toFixed(2);

}

//EXEMPLO DO CÓDIGO PARA UM PRODUTO
function productItem(product, indice) {
  const item = `<div class="product" data-name="${product.name}" data-brand="nyx" data-type="${product.product_type}" tabindex="508" onClick="showDetails(${indice})">
  <figure class="product-figure">
    <img src="${product.image_link}" width="215" height="215" alt="${product.name}" onerror="javascript:this.src='img/unavailable.png'">
  </figure>
  <section class="product-description">
    <h1 class="product-name">${product.name}</h1>
    <div class="product-brands"><span class="product-brand background-brand">${product.brand}</span>
<span class="product-brand background-price">R$ ${getAdjustedPrice(product.price)}</span></div>
  </section>
  <p id="details_${indice}"></p>
</div>`;

  return item;
}

//EXEMPLO DO CÓDIGO PARA OS DETALHES DE UM PRODUTO
function loadDetails(indice) {

  let product = arrayProducts[indice];

  let details = `<section class="product-details"><div class="details-row">
        <div>Brand</div>
        <div class="details-bar">
          <div class="details-bar-bg" style="width= 250">${product.brand}</div>
        </div>
      </div><div class="details-row">
        <div>Price</div>
        <div class="details-bar">
          <div class="details-bar-bg" style="width= 250">R$ ${getAdjustedPrice(product.price)}</div>
        </div>
      </div><div class="details-row">
        <div>Rating</div>
        <div class="details-bar">
          <div class="details-bar-bg" style="width= 250">${product.rating || 0}</div>
        </div>
      </div><div class="details-row">
        <div>Category</div>
        <div class="details-bar">
          <div class="details-bar-bg" style="width= 250">${product.category || "&nbsp;"}</div>
        </div>
      </div><div class="details-row">
        <div>Product_type</div>
        <div class="details-bar">
          <div class="details-bar-bg" style="width= 250">${product.product_type}</div>
        </div>
      </div></section>`;

  return details;
}
