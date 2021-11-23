import {Category, Genre} from "./models";


export function getGenresFromCategory(genres: Genre[], category: Category) {
    console.log(genres);
    return genres.filter(
        genre => genre.categories.filter(cat => cat.id === category.id).length !== 0
    )
}