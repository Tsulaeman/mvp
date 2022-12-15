import endpoints from "../endpoints";
import { AppConfig, Auth, AuthResponse, AuthUser, BuyProductResponse, LaravelPagination, Product } from "../types";
import AbstractRestService from "./AbstractRestService";

const { baseUrl } = endpoints;

export default class RestService extends AbstractRestService {

    token: string | null;

    constructor() {
        super(baseUrl);
        this.token = localStorage.getItem("access_token");
    }

    async login(values: Auth): Promise<AuthResponse> {
        const response = await this.post('auth/login', values);
        const responseData: AuthResponse = await response.json();
        if(!response.ok) {
            throw responseData
        }
        localStorage.setItem('auth', JSON.stringify(responseData));
        return responseData;
    }

    async register(values: Auth): Promise<AuthUser> {
        const response = await this.post('auth/register', values);
        const responseData = await response.json();
        if(!response.ok) {
            throw responseData
        }
        return responseData;
    }

    async logout(): Promise<{ message: string} > {
        const response = await this.post('auth/logout', null);
        const responseData = await response.json();
        if(!response.ok) {
            window.location.replace("/login");
            throw responseData
        }
        localStorage.clear();
        window.location.replace("/login");
        return responseData;
    }


    /**
     * Get the auth user by fetching from the server or from local
     *
     * @returns  Promise<AuthUser>
     */
    async me(): Promise<AuthUser> {
        const response = await this.get('auth/me', null);
        const responseData = await response.json();
        if(!response.ok) {
            throw responseData
        }
        return responseData;
    }

    /**
     * Get the apps config
     *
     * @returns  Promise<AuthUser>
     */
    async config(): Promise<AppConfig> {
        const response = await this.get('config', null);
        const responseData = await response.json();
        if(!response.ok) {
            throw responseData
        }
        return responseData;
    }

    /**
     * Get the Products
     *
     * @returns  Promise<AuthUser>
     */
    async getProducts(): Promise<LaravelPagination<Product[]>> {
        const response = await this.get('products', null);
        const responseData = await response.json();
        if(!response.ok) {
            throw responseData
        }
        return responseData;
    }

    /**
     * Get a Product
     *
     * @returns  Promise<AuthUser>
     */
    async getProduct(productId: number | null = null): Promise<Product> {
        const response = await this.get(`products/${productId}`, null);
        const responseData = await response.json();
        if(!response.ok) {
            throw responseData
        }
        return responseData;
    }

     /**
     * Get the apps config
     *
     * @returns  Promise<AuthUser>
     */
     async addProduct(product: Product): Promise<Product> {
        const response = await this.post('/products/create', product);
        const responseData = await response.json();
        if(!response.ok) {
            throw responseData
        }
        return responseData;
    }

    /**
     * Buy a product
     *
     * @returns  Promise<AuthUser>
     */
    async buyProduct(productId: number, amount: number): Promise<BuyProductResponse> {
        const response = await this.post('buyers/buy', {productId, amount });
        const responseData = await response.json();
        if(!response.ok) {
            throw responseData
        }
        return responseData;
    }


    /**
     * Get the apps config
     *
     * @returns  Promise<AuthUser>
     */
    async deposit(deposit: number): Promise<AuthUser> {
        const response = await this.patch('buyers/deposit', { deposit });
        const responseData = await response.json();
        if(!response.ok) {
            throw responseData
        }
        return responseData;
    }

    /**
     * Get the apps config
     *
     * @returns  Promise<AuthUser>
     */
    async resetDeposit(): Promise<AuthUser> {
        const response = await this.patch('buyers/reset', null);
        const responseData = await response.json();
        if(!response.ok) {
            throw responseData
        }
        return responseData;
    }

}