import ProductsPage from "../../pages/products";
import ProductPage from "../../pages/product";
import CartPage from "../../pages/cart";
import ErrorPage from "../../pages/error404";
import Header from "../view/header";
import Footer from "../view/footer";
import Controller from "../controller/controller";
import {URLParams} from "../../types/URLParams";
import {getURLParams} from "../../utils/getURLParams";
// import {productsData} from "../../data/products";
import Cart from "../view/cart";

import Promokod from "../view/promokod";
import {Modal} from "../view/modal";

export let cart = new Cart();
export let promokod = new Promokod();
console.log('promokod: ', promokod);


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

    cart.updateDataInHeader(Header);
}

if (promokod) {
    promokod.arrayAppliedPromokod = [{"id": "RS", "name": "Rolling Scopes School", "discount": 10}, {
        "id": "EPM",
        "name": "EPAM Systems",
        "discount": 10
    }];

    let arrayAppliedPromokodFromLocal = localStorage.getItem('arrayAppliedPromokods');

    if (arrayAppliedPromokodFromLocal) {
        promokod.arrayAppliedPromokod = JSON.parse(arrayAppliedPromokodFromLocal);
    } else {
        console.log('there is no array of Promokods fromlocal');
    }

}

class App {
    private readonly controller: Controller;
    private container: HTMLElement;
    private initialPage: ProductsPage;
    private static defaultPageId = "current-page"

    private modal: Modal;

    constructor() {
        this.controller = new Controller()
        this.container = document.body;
        this.initialPage = new ProductsPage("products-page", this.controller)
        this.modal = new Modal()
    }

    private renderNewPage({hashPage, idProduct}: URLParams) {
        const currentPage = <HTMLDivElement>document.getElementById(App.defaultPageId)
        currentPage.innerHTML = ""
        let page: CartPage | ProductPage | ProductsPage | ErrorPage | null = null;
        if (hashPage === "") {
            page = new ProductsPage("products-page", this.controller);
        } else if (hashPage === "cart") {
            page = new CartPage("cart-page", this.handleModal);
        } else if (hashPage.includes("products")) {
            page = new ProductsPage("products-page", this.controller);
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
        addEventListener("hashchange", this.handleURLParams)
        addEventListener("popstate", this.handleURLParams)
    }

    handleURLParams = () => {
        let URLParams: URLParams = getURLParams(window.location.hash)
        if (URLParams.queryParams) {
            this.controller.setQueryParamsFromURLToModel(URLParams.queryParams)
        }
        this.renderNewPage(URLParams)
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

    private handleModal = () => {
        this.modal.handleModal()
    }

    run() {
        addEventListener("DOMContentLoaded", () => {

            this.container.append(Header)
            this._checkLocation()

            this.container.append(Footer)
            this.container.append(this.modal.render())
            this.enableRouteChange()
        }, true)

    }
}

export default App