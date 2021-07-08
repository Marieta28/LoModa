const headerCityButton = document.querySelector(".header__city-button");
console.log(headerCityButton);
let hash = location.hash.substring(1); 

headerCityButton.textContent = localStorage.getItem('lomoda-location') || 'Ваш Город?'


const updateLocation = () => {
const lsLocation = localStorage.getItem('lomoda-location');

  headerCityButton.textContent = localStorage.getItem('lomoda-location') || 'Ваш Город?' ;
}


headerCityButton.addEventListener('click', () => { 
  const city = prompt('Укажите ваш город!').trim();
   headerCityButton.textContent = city;
 if (city !== null){
     localStorage.setItem('lomoda-location', city);
 }
  updateLocation()
});

// blocking scrool

const disableScroll = () => {

  if (document.disableScroll) return;
  const widthScroll = window.innerWidth - document.body.offsetWidth;
  document.disableScroll = true;

  document.body.dbScrollY = window.scrollY;
  document.body.style.cssText = `
    position: fixed;
    top: ${-window.scrollY}px;
    left: 0;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    padding-right: ${widthScroll}px;
  `;
};

const enableScroll = () => {
   document.disableScroll = false;
 document.body.style.cssText = '';
 window.scroll({
   top: document.body.dbScrollY,
 })
};

// Modal Window madalni okno

const subheaderCart = document.querySelector(".subheader__cart");
const cartOverlay = document.querySelector(".cart-overlay");


const cartModalOpen = () => {
  cartOverlay.classList.add('cart-overlay-open');disableScroll();
};

const cartModalClose = () => {
  cartOverlay.classList.remove('cart-overlay-open'); enableScroll();
};




// Zapros basi dannix

const getData = async () => {
  const data = await fetch('db.json');

  if(data.ok){
    return data.json()
  } else{
    throw new Error(`Dannie nebili polucheni, ashibka ${data.status} ${data.statusText}`)
  }

};

const getGoods = (callback, prop, value) => {
  getData()
    .then(data => {
      if (value){
        callback(data.filter(item => item[prop] === value));
      } else {
        callback(data);
      }
      
    })
    .catch(err => {
      console.log(err)
    });
};


subheaderCart.addEventListener('click', cartModalOpen);

cartOverlay.addEventListener('click', (event) => {
  const target = event.target;

  if (target.matches('.cart__btn-close')  || target.matches('.cart-overlay')) {
    cartModalClose();
  }
});


// stranice kategorii


try{

  const goodsList = document.querySelector('.goods__list');

  if(!goodsList) {
      throw 'This is not a goods page!'
  }

  const goodsTitle = document.querySelector('.goods__title');

  const changeTitle = () => {
    goodsTitle.textContent = document.querySelector(`[href*="#${hash}"]`).textContent;
  };



  const createCard = ({ id, preview, cost, brand, name, sizes }) => {


    const li = document.createElement('li');

    li.classList.add('goods__item');

    li.innerHTML = `
      <article class="good">
        <a class="good__link-img" href="card-good.html#${id}">
         <img class="good__img" src="goods-image/${preview}" alt="logo: img">
        </a>
        <div class="good__description">
          <p class="good__price">${cost} &#8381;</p>
          <h3 class="good__title">${brand} <span class="good__title__grey">/ ${name}</span></h3>
          ${sizes ? 
            `<p class="good__sizes">Размеры (RUS): <span class="good__sizes-list">${sizes.join(' ')}</span></p>` : 
            ' '}
          
          <a class="good__link" href="card-good.html#${id}">Подробнее</a>
        </div>
      </article>
    `;

    return li;
  };

const renderGoodsList = data => {
  goodsList.textContent = ''; //udalyaem vsyo iz lista

  data.forEach(item => {
    const card =  createCard(item); 
    goodsList.append(card);
  });
};

  window.addEventListener('hashchange', () => {
    hash = location.hash.substring(1);
    changeTitle();
     getGoods(renderGoodsList, 'category', hash);
     
  });
  changeTitle();
  getGoods(renderGoodsList, 'category', hash);

} catch (err) {
    console.warn(err);
}

// stranica tovara
try{

  if (!document.querySelector('.card-good')){
    throw 'This is not a card-good page!';
  }

  const cardGoodImage = document.querySelector('.card-good__image');
  const cardGoodBrand = document.querySelector('.card-good__brand');
  const cardGoodTitle = document.querySelector('.card-good__title');
  const cardGoodPrice = document.querySelector('.card-good__price');
  const cardGoodColor = document.querySelector('.card-good__color');
  const cardGoodSelectWrapper = document.querySelectorAll('.card-good__select__wrapper');
  const cardGoodColorList = document.querySelector('.card-good__color-list');
  const cardGoodSizes = document.querySelector('.card-good__sizes');
  const cardGoodSizesList = document.querySelector('.card-good__sizes-list');
  const cardGoodBuy = document.querySelector('.card-good__buy');
  

  const generateList  = data => data.reduce((html, item, i) => html + 
  `<li class="card-good__select-item" data-id="${i}">${item}</li>`, '');

  const renderCardGood = ([{brand, name, cost, color, sizes, photo}]) => {
      cardGoodImage.src = `goods-image/${photo}`;
      cardGoodImage.alt = `${brand} ${name}`;
      cardGoodBrand.textContent = brand;
      cardGoodTitle.textContent = name;
      cardGoodPrice.textContent = `${cost} ₽`;
      if(color){
        cardGoodColor.textContent = color[0];
        cardGoodColor.dataset.id = 0;
        cardGoodColorList.innerHTML = generateList(color);
      } else {
        cardGoodColor.style.display = 'none';
      }
      if(sizes){
        cardGoodSizes.textContent = sizes[0];
        cardGoodSizes.dataset.id = 0;
        cardGoodSizesList.innerHTML = generateList(sizes);
      } else {
        cardGoodSizes.style.display = 'none';
      }
      
  };
 
  cardGoodSelectWrapper.forEach(item => {
    item.addEventListener('click', e =>{
        const target = e.target;

        if (target.closest('.card-good__select')){
          target.classList.toggle('card-good__select__open');
        }

        if (target.closest('.card-good__select-item')){
          const cardGoodSelect = item.querySelector('.card-good__select');
          cardGoodSelect.textContent = target.textContent;
          cardGoodSelect.dataset.id = target.dataset.id;
          cardGoodSelect.classList.remove('card-good__select__open');
        }
    });
  });

  getGoods(renderCardGood, 'id', hash);

} catch (err) {
    console.warn(err);
}
