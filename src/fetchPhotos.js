export default class ApiPhotoService{
    constructor(){
        this.URL = 'https://pixabay.com/api/';
        this.KEY = '31408246-67a4d6e3ce2dfa0478d87f2fd';
        this.PAGE = 1;
        this.PER_PAGE = 40;
        this.searchQuery = '';
    }
    fetchPhoto(){
        const searchParams = new URLSearchParams({
            key:this.KEY,
            q:this.searchQuery,
            image_type:"photo",
            orientation:"horizontal",
            safesearch:true,
            per_page: this.PER_PAGE,
            page: this.PAGE
          });
        const newParams = searchParams.toString()
        return fetch(`${this.URL}?${newParams}`)
        .then(response => response.json())
        .then(data =>{
            this.PAGE += 1;
            return data;
        })
    }
    resetPage(){
        this.PAGE = 1;
    }
    get query(){
        return this.searchQuery;
    }
    set query(newQuery){
        this.searchQuery = newQuery;
    }
}


