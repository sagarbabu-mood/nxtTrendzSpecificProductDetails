import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Header from '../Header'
import ProductCard from '../ProductCard'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiConstants = {
  inProgress: 'INPROGRESS',
  onSuccess: 'SUCCESS',
  onFailure: 'FAILURE',
}

class ProductItemDetails extends Component {
  state = {
    isLoading: apiConstants.inProgress,
    productDetails: {},
    similarProducts: [],
    count: 1,
  }

  componentDidMount() {
    this.getSpecificProductDetails()
  }

  getSpecificProductDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const formattedData = {
        availability: data.availability,
        brand: data.brand,
        description: data.description,
        id: data.id,
        imageUrl: data.image_url,
        price: data.price,
        rating: data.rating,
        style: data.style,
        title: data.title,
        totalReviews: data.total_reviews,
      }
      const similarProductsFormattedData = data.similar_products.map(
        eachProduct => ({
          availability: eachProduct.availability,
          brand: eachProduct.brand,
          description: eachProduct.description,
          id: eachProduct.id,
          imageUrl: eachProduct.image_url,
          price: eachProduct.price,
          rating: eachProduct.rating,
          style: eachProduct.style,
          title: eachProduct.title,
          totalReviews: eachProduct.total_reviews,
        }),
      )
      this.setState({
        isLoading: apiConstants.onSuccess,
        similarProducts: similarProductsFormattedData,
        productDetails: formattedData,
      })
    } else {
      this.setState({isLoading: apiConstants.onFailure})
    }
  }

  renderFailureView = () => (
    <div className="products-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="products-failure-img"
      />
      <h1 className="product-failure-heading-text">Product Not Found</h1>
      <Link to="/products">
        <button className="logout-desktop-btn" type="button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  onDecrement = () => {
    const {count} = this.state
    if (count > 1) {
      this.setState(prevState => ({count: prevState.count - 1}))
    }
  }

  onIncrement = () => {
    this.setState(prevState => ({count: prevState.count + 1}))
  }

  renderSuccessView = () => {
    const {productDetails, count, similarProducts} = this.state
    const {
      availability,
      brand,
      description,
      imageUrl,
      price,
      rating,
      title,
      totalReviews,
      product,
    } = productDetails

    return (
      <>
        <div className="product-details-success-view">
          <div className="product-details-container">
            <img src={imageUrl} alt="product" className="product-image" />
            <div className="product">
              <h1 className="product-name">{title}</h1>
              <p className="price-details">Rs {price}/-</p>
              <div className="rating-and-reviews-count">
                <div className="rating-container">
                  <p className="rating">{rating}</p>
                  <img
                    src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                    alt="star"
                    className="star"
                  />
                </div>
                <p className="reviews-count">{totalReviews} Reviews</p>
              </div>
              <p className="product-description">{description}</p>
              <div className="label-value-container">
                <p className="label">Available:</p>
                <p className="value">{availability}</p>
              </div>
              <div className="label-value-container">
                <p className="label">Brand:</p>
                <p className="value">{brand}</p>
              </div>
              <hr className="horizontal-line" />
              <div className="quantity-container">
                <button
                  type="button"
                  className="quantity-controller-button"
                  onClick={this.onDecrement}
                  data-testid="minus"
                >
                  <BsDashSquare className="quantity-controller-icon" />
                </button>
                <p className="quantity">{count}</p>
                <button
                  type="button"
                  className="quantity-controller-button"
                  onClick={this.onIncrement}
                  data-testid="plus"
                >
                  <BsPlusSquare className="quantity-controller-icon" />
                </button>
              </div>
              <button type="button" className="button add-to-cart-btn">
                ADD TO CART
              </button>
            </div>
          </div>
          <h1 className="similar-products-heading">Similar Products</h1>
          <ul className="similar-products-list">
            {similarProducts.map(eachSimilarProduct => (
              <SimilarProductItem
                productData={eachSimilarProduct}
                key={eachSimilarProduct.id}
              />
            ))}
          </ul>
        </div>
      </>
    )
  }

  renderLoadingView = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderView = () => {
    const {isLoading} = this.state
    switch (isLoading) {
      case apiConstants.inProgress:
        return this.renderLoadingView()
      case apiConstants.onSuccess:
        return this.renderSuccessView()
      case apiConstants.onFailure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        {this.renderView()}
      </div>
    )
  }
}

export default ProductItemDetails
