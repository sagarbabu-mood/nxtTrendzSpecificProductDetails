// Write your code here

import './index.css'

const SimilarProductItem = props => {
  const {productData} = props
  const {brand, price, rating, imageUrl, title} = productData

  return (
    <li className="similar-item-container">
      <div className="image-container">
        <img src={imageUrl} alt="similar product" className="similar-image" />
        <div className="data-container">
          <h1 className="similar-title">{title}</h1>
          <p className="brand">by {brand}</p>

          <div className="similar-review-container">
            <p className="price">Rs {price}/-</p>
            <div className="rating-container">
              <p className="rating">{rating}</p>
              <img
                src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                className="star"
                alt="star"
              />
            </div>
          </div>
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
