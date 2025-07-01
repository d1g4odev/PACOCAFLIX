import { Genre } from "./Genre.model"

export class MovieFromApi{
    id: number | undefined
    title: String | undefined
    backdrop_path: string | undefined   //caminho para imagem de fundo
    original_title: string | undefined  //título do filme
    release_date: string | undefined //data de lançamento
    poster_path: string | undefined  //caminho para imagem do poster
    overview: string | undefined //resumo do filme
    genres: Genre[] | undefined //genero do filme
    genre: Genre | undefined
}