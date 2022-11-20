import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ApiPhotoService from './fetchPhotos.js'
import SimpleLightbox from "simplelightbox";

const refs = {
    searchForm : document.getElementById('search-form'),
    allPhotos : document.querySelector('.gallery'),
    btnLoadMore : document.querySelector('.load-more')
}

let counter = 0;
const apiPhotoService = new ApiPhotoService();

refs.searchForm.addEventListener('submit',onSubmitSearchForm)
refs.btnLoadMore.addEventListener('click',onLoadMore)
function onSubmitSearchForm(e){
    e.preventDefault();
    apiPhotoService.query = e.currentTarget.elements.searchQuery.value;
    clearAll();
     if(apiPhotoService.query === ''){
        return;
    }
    apiPhotoService.resetPage();
    apiPhotoService.fetchPhoto().then(data =>{
        console.log(data)
        const {hits, totalHits} = data;
                if (hits.length === 0) {
                Notify.failure('Sorry, there are no images matching your search query. Please try again.');
                return;
                }
                renderMarkupPhotos(data);
                Notify.success(`Hooray! We found ${totalHits} images.`);
                refs.btnLoadMore.hidden = false;

            })
        }   

function onLoadMore(){
    apiPhotoService.fetchPhoto().then(data =>{  
        renderMarkupPhotos(data)
   
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
        `<div class="photo-card">
        <a class="photo-link" href=${largeImageURL}>
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
      </div>`).join('')
      refs.allPhotos.insertAdjacentHTML('beforeend',markup);
      hitsCounter(data);
}

// allPhotos.addEventListener('click',selectGalleryElem);

// function selectGalleryElem(evt){
//     evt.preventDefault();
//     if (evt.target.nodeName !== 'IMG'){
//         return;
//     }
//     lightbox.next()
// };
// const lightbox = new SimpleLightbox('.gallery .photo-link',{
//     captionsData: 'alt',
//     captionsDelay: 250,
// }
// );

function clearAll(){
    refs.allPhotos.innerHTML = '';
}

function hitsCounter(data) {
    counter += data.hits.length;
  
    if (counter >= data.totalHits) {  
      
      refs.btnLoadMore.hidden = true;
  
      return Notify.failure("We're sorry, but you've reached the end of search results.");
    };
  }