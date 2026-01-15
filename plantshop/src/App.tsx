import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "./store";
import AppRoutes from "./routes/AppRoutes";
import {setCartItems} from "./store/cartSlice";
import {setWishlist} from "./store/wishlistSlice";
import {setProducts} from "./store/productSlice";
import {productService} from "./services/product.service";

function App() {
    const dispatch = useDispatch();

    //LOAD PRODUCTS
    useEffect(() => {
        productService.getAll().then(data => {
            dispatch(setProducts(data));
        });
    }, [dispatch]);

    //LOAD WISHLIST
    useEffect(() => {
        const stored = localStorage.getItem("user");
        let key = "wishlist_guest";

        if (stored) {
            try {
                const {user} = JSON.parse(stored);
                if (user?.id) key = `wishlist_user_${user.id}`;
            } catch (err) {
                console.warn("Cannot parse user from localStorage", err);
            }
        }

        const wishlist = JSON.parse(localStorage.getItem(key) || "[]");
        dispatch(setWishlist(wishlist));
    }, [dispatch]);

    //SAVE WISHLIST
    const wishlistItems = useSelector(
        (state: RootState) => state.wishlist.items
    );

    useEffect(() => {
        const stored = localStorage.getItem("user");
        let key = "wishlist_guest";

        if (stored) {
            try {
                const {user} = JSON.parse(stored);
                if (user?.id) key = `wishlist_user_${user.id}`;
            } catch (err) {
                console.warn("Cannot parse user from localStorage", err);
            }
        }

        localStorage.setItem(key, JSON.stringify(wishlistItems));
    }, [wishlistItems]);

    //LOAD CART
    useEffect(() => {
        const stored = localStorage.getItem("user");
        let key = "cart_guest";

        if (stored) {
            try {
                const {user} = JSON.parse(stored);
                if (user?.id) key = `cart_user_${user.id}`;
            } catch (err) {
                console.warn("Cannot parse user from localStorage", err);
            }
        }

        const cart = JSON.parse(localStorage.getItem(key) || "[]");
        dispatch(setCartItems(cart));
    }, [dispatch]);

    return <AppRoutes/>;
}

export default App;
