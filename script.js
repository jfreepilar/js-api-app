const navbarFirstLayer = document.querySelector('.header');
const date = document.querySelector('.date');
const navbarSecondLayer = document.querySelector('.category-container');
const categoryList = document.querySelector('.category');
const newsGrid = document.querySelector('.news-grid');
const loadMoreBtn = document.querySelector('.load-more');

const today = new Date();
const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
const formattedDate = today.toLocaleDateString('en-US', options);
date.textContent = formattedDate;


const categories = ['Top' , 'World', 'Business', 
                      'Technology', 'Politics', 'Entertainment', 
                      'Sports', 'Lifestyle', 'Health'];

categories.map(category => {
    const item = document.createElement('li');
    item.textContent = category;
    categoryList.appendChild(item);
});

const listItems = categoryList.querySelectorAll('li');

let nextPage = 1;
let currentCategory = '';
let initialResults = [];

const getNews = async (category, pageNumber = 1) => {
    try {
        const apiKey = 'pub_461270c5064f23a78a1603590a6452d0e031b';
        let url = `https://newsdata.io/api/1/latest?apikey=${apiKey}&language=en&country=ph&category=${category}`;

        if (pageNumber > 1) {
             url += `&page=${pageNumber}`
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
            }

        const responseData = await response.json();

        console.log(responseData); 

        if (pageNumber === 1) {
            initialResults = responseData.results;
            newsGrid.innerHTML = '';
            displayNews(initialResults.slice(0,9));   
            } else {
                displayNews(responseData.results); 
            }

        nextPage = responseData.nextPage || null;
        } catch (error) {
            console.error(`Error fetching or processing news: ${error}`);
        }
    };

const displayNews = (articles) => {
    articles.forEach(article => {
        const imageUrl = article.image_url ? article.image_url : 'img/no-image.png';
        const sourceIcon = article.source_icon ? article.source_icon : 'img/no-image.png';
        const html = `
        <li class='news-box'>
            <a href='${article.link}' target='_blank'>
                <img class='news-image' src='${imageUrl}' alt="News article picture">
            </a>
            <h1 class='headline'>
                <a href='${article.link}' target='_blank'>${article.title}</a>
            </h1>
            <div class='source-container'>
                <img class="source-icon" src="${sourceIcon}" alt="News article picture">
                <a class='source-url' href='${article.source_url}'>${article.source_url.slice(8)}</a>
            </div>
        </li>
        `;
        newsGrid.insertAdjacentHTML("beforeend", html);
    });
};

const handleScroll = () => {
    if (window.scrollY >= 1 ) {
        navbarFirstLayer.classList.add('hide-header');
        navbarSecondLayer.classList.add('fixed-navbar');
        categoryList.classList.add('fixed-category')
    } else {
        navbarFirstLayer.classList.remove('hide-header');
        navbarSecondLayer.classList.remove('fixed-navbar');
        categoryList.classList.remove('fixed-category')
    }
};

window.addEventListener('scroll', handleScroll);

listItems.forEach(listItem => {
    listItem.addEventListener('click', () => {
        currentCategory = listItem.textContent;
        nextPage = 1;
        getNews(currentCategory);
    });
});

loadMoreBtn.addEventListener('click', () => {
   if (nextPage) {
    getNews(currentCategory, nextPage)
   }
});

document.addEventListener('DOMContentLoaded', () => {
    currentCategory = 'Top';
    getNews(currentCategory);
});