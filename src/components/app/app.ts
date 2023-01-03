import ProductsPage from "../../pages/products";
import ProductPage from "../../pages/product";
import CartPage from "../../pages/cart";
import ErrorPage from "../../pages/error404";
import Header from "../view/header";
import Footer from "../view/footer";
import Controller from "../controller/controller";
import {URLParams} from "../../types/URLParams";
import {getURLParams} from "../../utils/getURLParams";
import {productsData} from "../../data/products";
import Cart from "../view/cart";
import Model from "../model";
import {SortKeys} from "../view/sortBy";
import {ModesViewKeys} from "../view/modeViewProductsList";

export let cart = new Cart();

if (cart) {
    let generalCount = localStorage.getItem('generalCount');
    let generalSum = localStorage.getItem('generalSum');
    let arrayCartItemsFromLocal = localStorage.getItem('arrayCartItems');

    if (generalCount) {
        cart.generalCountInCart = +generalCount;
    }

    if (generalSum) {
        cart.generalSummInCart = +generalSum;
    }

    if (arrayCartItemsFromLocal) {
        cart.arrayCartItems = JSON.parse(arrayCartItemsFromLocal);
    }
}
console.log('cart in app: ', cart);

class App {
    private container: HTMLElement;
    private initialPage: ProductsPage;
    private static defaultPageId = "current-page"
    private readonly controller: Controller;
    private model: Model;

    constructor() {
        this.model = new Model()
        this.controller = new Controller()
        this._checkLocalStorage()
        this.container = document.body;
        this.initialPage = new ProductsPage("products-page", productsData, this.controller)
    }

    private renderNewPage({hashPage, idProduct}: URLParams) {
        const currentPage = <HTMLDivElement>document.getElementById(App.defaultPageId)
        currentPage.innerHTML = ""
        let page: CartPage | ProductPage | ProductsPage | ErrorPage | null = null;
        if (hashPage === "") {
            page = new ProductsPage("products-page", productsData, this.controller);
        } else if (hashPage === "cart") {
            page = new CartPage("cart-page");
        } else if (hashPage.includes("products")) {
            page = new ProductsPage("products-page", productsData, this.controller);
        } else if (hashPage.includes("product/")) {
            if (idProduct) {
                let product = this.controller.getProduct(idProduct)
                page = new ProductPage("product-page", product);
            } else {
                page = new ErrorPage("error-page");
            }

        } else {
            page = new ErrorPage("error-page");
        }
        if (page) {
            const pageHTML = page.render()
            currentPage.append(pageHTML)
        }
    }

    private enableRouteChange() {
        addEventListener("hashchange", () => {
            let URLParams: URLParams = getURLParams(window.location.hash)
            console.log('URLParams: ', URLParams);
            this.renderNewPage(URLParams)
        })

        // window.onpopstate = () => {
        //     console.log("aa")
        //     // let URLParams: URLParams = getURLParams(window.location.hash)
        //     // App.renderNewPage(URLParams)
        // }
    }

    private _checkLocation() {
        const pageHTML = this.initialPage.render()
        pageHTML.id = App.defaultPageId

        this.container.append(pageHTML)

        let URLParams: URLParams = getURLParams(window.location.hash)

        if (URLParams.queryParams) {
            this.controller.setQueryParamsFromURLToModel(URLParams.queryParams)
        }

        if (URLParams.hashPage) {
            this.renderNewPage(URLParams)
        }
    }

    private _checkLocalStorage() {
        // let viewLS = localStorage.getItem("view") as ModesViewKeys
        // let sortLS = localStorage.getItem("sort") as SortKeys
        // if (viewLS) {
        //     this.controller.setView(viewLS)
        // }
        // if (sortLS) {
        //     this.controller.setSort(sortLS)
        // }
    }

    run() {
        addEventListener("DOMContentLoaded", () => {

            this.container.append(Header)

            this._checkLocation()

            this.container.append(Footer)

            this.enableRouteChange()
        }, true)

    }
}

export default App