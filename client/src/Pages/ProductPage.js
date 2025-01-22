import React, { Component } from 'react';
import axios from 'axios';


class ProductPage extends Component {
    state = { products: [] };

    componentDidMount() {
        fetch('http://localhost:5000/products')

        axios.get("./products.js")
            .then(res =>
            {
                if(res.data)
                {
                    this.setState({products: res.data})
                }
                else
                {
                    console.log("Records not found")
                }

            })
            .then((res) => res.json())
            .then((data) => this.setState({ products: data }))
            .catch((err) => console.error(err));
    }

    render() {
        return (
            <div>
                <h1>Products</h1>
                <ul>
                    {this.state.products.map((product) => (
                        <li key={product._id}>
                            {product.name} - ${product.price}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default ProductPage;
