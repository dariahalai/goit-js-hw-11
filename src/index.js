import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ApiPhotoService from './fetchPhotos.js'
import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
    searchForm : document.getElementById('search-form'),
    allPhotos : document.querySelector('.gallery'),
    btnLoadMore : document.querySelector('.load-more'),
    guard : document.querySelector('.guard')
}

let totalPage = 13;

const apiPhotoService = new ApiPhotoService();

const lightbox = new SimpleLightbox('.photo-link',{
    captionsDelay: 100,
}
);

const params = {
  root: null,
  rootMargin: '200px',
  threshold: 1
};

function observeObj(entries){
console.log(entries)
entries.forEach(entry => {
  if (entry.isIntersecting) {
    observer.unobserve(entry.target);
    apiPhotoService.page += 1;
    if (entry.intersectionRatio === 1 && apiPhotoService.page === totalPage) {
      Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
  }
    apiPhotoService.fetchPhoto().then(data =>{  
      renderMarkupPhotos(data);
      const hasPhoto = apiPhotoService.page < totalPage && data.totalHits === 500;
      if (hasPhoto) {
        if (data.totalHits < 500) {
            return;
        }
        observer.observe(refs.guard);
    }
  })
}
})
};

const observer = new IntersectionObserver(observeObj, params);

refs.searchForm.addEventListener('submit',onSubmitSearchForm)
refs.allPhotos.addEventListener('click',selectGalleryElem);
document.addEventListener('scroll',lightScroll)

function selectGalleryElem(e){
  e.preventDefault();
};

function onSubmitSearchForm(e){
    e.preventDefault();
    apiPhotoService.query = e.currentTarget.elements.searchQuery.value;
    clearAll();
     if(apiPhotoService.query === ''){
        clearAll();
        Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        return;
    }
    apiPhotoService.resetPage();
    apiPhotoService.fetchPhoto().then(data =>{
        console.log(data)
        const {hits, totalHits} = data;
                if (hits.length === 0) {
                clearAll();
                Notify.failure('Sorry, there are no images matching your search query. Please try again.');
                return;
                }
                renderMarkupPhotos(data);
                observer.observe(refs.guard);
                Notify.success(`Hooray! We found ${totalHits} images.`);
            })
        }   

function renderMarkupPhotos(data){
    let markup = '';
    markup = data.hits.map(({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads})=>
        `<a class="photo-link" href=${largeImageURL}>
        <img class="gallery-image" src="${webformatURL}" alt="${tags}" loading="lazy" width = '300px' />
        <div class="info">
          <p class="info-item">
            <b>Likes</b>
          ${likes}
          </p>
          <p class="info-item">
            <b>Views</b>
          ${views}
          </p>
          <p class="info-item">
            <b>Comments</b>
          ${comments}
          </p>
          <p class="info-item">
            <b>Downloads</b>
          ${downloads}
          </p>
        </div>
        </a>
        `).join('')
      refs.allPhotos.insertAdjacentHTML('beforeend',markup);
      lightbox.refresh();
}

function clearAll(){
    refs.allPhotos.innerHTML = '';
}

function lightScroll(){
  const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});
}