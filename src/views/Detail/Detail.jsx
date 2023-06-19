import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { addFavorite, clearDetail, deleteFavorite, getDetail, deleteArt, getAllArts } from '../../redux/actions';
import { FaShoppingCart, FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa';
import Loader from '../../components/Loader/Loader';
import frame from './pngegg.png';
import styles from './Detail.module.css';

const Detail = () => {
  const { id } = useParams();
  const [isFav, setIsFav] = useState(false);
  const [rating, setRating] = useState(0);
  const detail = useSelector((state) => state.detail);
  const myFavorites = useSelector((state) => state.myFavorites);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    dispatch(getDetail(id)).finally(() => {
      setIsLoading(false);
    });

    return () => {
      dispatch(clearDetail());
    };
  }, [dispatch, id]);

  useEffect(() => {
    myFavorites.forEach((fav) => {
      if (fav.id === detail.id) {
        setIsFav(true);
      }
    });
  }, [detail.id, myFavorites]);

  const handleFavorite = () => {
    if (isFav) {
      setIsFav(false);
      dispatch(deleteFavorite(detail));
    } else {
      setIsFav(true);
      dispatch(addFavorite({ detail }));
    }
  };

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleDelete = () => {
    dispatch(deleteArt(detail.id));
    window.alert('Artwork deleted successfully');
    dispatch(getAllArts());
    navigate('/');
  };

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(detail.title)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
  };

  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
  };

  const handleInstagramShare = () => {
    const url = `https://www.instagram.com/?url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
  };

  if (isLoading || !detail) {
    return <Loader />;
  }

  return (
    <div className={styles.detailContainer}>
      <div className={styles.imgContainer}>
        <div className={styles.frameContainer}>
          <div className={styles.frame}>
            <img src={frame} alt='' />
          </div>
        </div>
        <div className={styles.imageWrapper}>
          <img src={detail.image} alt={detail.title} onLoad={() => setIsLoading(false)} />
        </div>
      </div>
      <div className={styles.propsContainer}>
        <h3>{detail.title}</h3>
        <hr className={styles.hr} />
        <p>
          <span>Artist:</span> {detail.authorName}
        </p>
        <p>
          <span>Year:</span> {detail.date}
        </p>
        <p>
          <span>Dimensions:</span> {detail.width} x {detail.height}
        </p>
        <p>
          <span>Price:</span> {detail.price} M
        </p>
        {detail.user && detail.user.userName.length > 0 ? (
          <div>
            <p>
              <span>Published By:</span> <span className={styles.user}> {detail.user.userName} </span>
            </p>
          </div>
        ) : null}
      </div>
      <div className={styles.actionsContainer}>
        {isFav ? (
          <button className={styles.likeStyle} onClick={handleFavorite}>
            ❤️
          </button>
        ) : (
          <button className={styles.likeStyle} onClick={handleFavorite}>
            🤍
          </button>
        )}
        <button className={styles.cartButton}>
          <FaShoppingCart className={styles.cartIcon} />
          Add to Cart
        </button>
        {detail.created && (
          <button className={styles.deleteButton} onClick={handleDelete}>
            Delete
          </button>
        )}
        <div>
          <div className={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((value) => (
              <button key={value} className={`${styles.ratingStar} ${value <= rating ? styles.ratingStarActive : ''}`} onClick={() => handleRatingChange(value)}>
                ★
              </button>
            ))}
          </div>
        </div>
        <div className={styles.shareButtons}>
          <button className={styles.shareButton} onClick={handleTwitterShare}>
            <FaTwitter className={styles.shareIcon} />
          </button>
          <button className={styles.shareButton} onClick={handleFacebookShare}>
            <FaFacebook className={styles.shareIcon} />
          </button>
          <button className={styles.shareButton} onClick={handleInstagramShare}>
            <FaInstagram className={styles.shareIcon} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Detail;
