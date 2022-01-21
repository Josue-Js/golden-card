import { MdAdd, MdRemove, MdDeleteOutline } from 'react-icons/md';
import { useCart } from '../../hooks/useCart';

import styles from './styles.module.scss';


type IProduct = {
  product_id: string;
  price_id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  rating: number
}

type Item = {
  product: IProduct;
  quantity: number
}


export function CartItem({ product, quantity }: Item) {

  const { addCart, removeCart } = useCart();


  return (
    <div className={styles.container}>

      <figure className={styles.image}>
        <img src={product.image} />
      </figure>

      <div className={styles.item}>
        <div className={styles.info}>
          <h2 className={styles.title}>
            {product.title}
          </h2>
          <p className={styles.price}>
            <span>R$</span>
            <strong>{product.price}</strong>
          </p>
        </div>

        <div className={styles.updateItem}>
          <span>Quantidade</span>
          <div className={styles.buttons}>
            <button className={styles.removeItem} onClick={() => removeCart(product)}>
              {quantity === 1
                ? (<MdDeleteOutline size={18} fill="#f9f9f9" />)
                : (<MdRemove size={22} fill="#f9f9f9" />)
              }
            </button>
            <span className={styles.qtdItem}>
              {quantity}
            </span>
            <button className={styles.addItem} onClick={() => addCart(product)}>
              <MdAdd size={22} fill="#f9f9f9" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}