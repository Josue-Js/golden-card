import { CartProvider } from '../contexts/cart';
import '../styles/globals.scss'

function MyApp({ Component, pageProps }) {
  return (
    <CartProvider>
      <Component {...pageProps} />
    </CartProvider>
  );
}

export default MyApp
