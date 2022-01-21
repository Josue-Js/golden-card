import { useRouter } from 'next/router';
import { MdStarRate, MdClose } from 'react-icons/md';
import { useCart } from '../../hooks/useCart';

import styles from './styles.module.scss'

type IProduct = {
  product_id: string;
  price_id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  rating: number;
}

type Props = {
  isVisible: boolean;
  product: IProduct;
  closeModal: () => void;
}

export function Modal({ isVisible, product, closeModal }: Props) {

  const router = useRouter();
  const { cart, addCart } = useCart();


  const rating = [...new Array(5)].map((_, index) => {
    return product.rating < index + 1
      ? (<MdStarRate size={24} fill="#CCCCCC" key={index} />)
      : (<MdStarRate size={24} fill="#EAB600" key={index} />)
  });


  function handleBuy() {

    const isProductIsInTheCart = cart.items
      .filter(item => item.product.product_id === product.product_id);

    if (!isProductIsInTheCart.length) {
      addCart(product);
    }
    router.push('/cart')
  }



  return (
    <>
      {isVisible &&
        <div className={styles.overlay}>
          <div className={styles.modal}>

            <button className={styles.close} type="button" onClick={closeModal}>
              <MdClose size={24} fill="#fff" />
            </button>

            <figure className={styles.image}>
              <img src={product.image} alt="gift card" />
            </figure>

            <div className={styles.wrapInfo}>
              <div className={styles.info}>
                <span className={styles.title}>
                  {product.title}
                </span>
                <div className={styles.rate}>
                  {rating}
                </div>
                <span className={styles.price}>
                  R$ {product.price}
                </span>
              </div>

              <p className={styles.overview}>
                {product.description}
              </p>

              <div className={styles.buttons}>
                <button
                  type="button"
                  className={styles.addCart}
                  onClick={() => addCart(product)}
                >
                  add cart
                </button>
                <button
                  type="button"
                  className={styles.buy}
                  onClick={handleBuy}
                >
                  buy
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  );
}