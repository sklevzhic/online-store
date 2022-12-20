import {ProductInterface} from "../../types/Product";
import {productsData} from "../../data/products";
import {FilterParams} from "../../types/FilterParams";
import {generateURL} from "../../utils/generateURL";
import defaultState from "../state/state";
import {types} from "sass";
import Number = types.Number;

class Controller {
    products: ProductInterface[];
    filteredProducts: ProductInterface[];

    constructor() {
        this.products = defaultState.products
        this.filteredProducts = []
    }

    getProducts(params: FilterParams) {
        let url = generateURL(params)

        this.filteredProducts = this.products.filter(el => {
            if (url === "") {
                return el
            } else {
                if (el.brand.toLowerCase() === "Apple".toLowerCase() || el.brand.toLowerCase() === "Samsung".toLowerCase()) {
                    return el
                }
            }
        })
        return this.filteredProducts
    }

    getProduct(id: string | number): ProductInterface {
        return this.products.filter(n => n.id.toString() === id.toString())[0]
    }
}

export default Controller