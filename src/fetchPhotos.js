const axios = require('axios').default;
import { Notify } from 'notiflix/build/notiflix-notify-aio';

export default class ApiPhotoService{
    constructor(){
        this.URL = 'https://pixabay.com/api/';
        this.KEY = '31408246-67a4d6e3ce2dfa0478d87f2fd';
        this.PAGE = 1;
        this.PER_PAGE = 40;
        this.searchQuery = '';
    }
     async fetchPhoto(){
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
        try{ const response = await axios.get(`${this.URL}?${newParams}`)
        if (response.status !== 200) {
            throw new Error(response.status);
          }
          this.PAGE += 1;
          return response.data;
        } catch (error) {
         Notify.failure(error.message);
        }
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


