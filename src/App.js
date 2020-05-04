import React, { Component } from 'react';
import './App.css';
import { Container, Button, Alert } from 'react-bootstrap';
import ProductList from './ProductList';
import AddProduct from './AddProduct';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAddProduct: false,
            error: null,
            response: {},
            product: {},
            isEditProduct: false,
            url: 'http://localhost:1300/api/'
        }
        this.onFormSubmit = this.onFormSubmit.bind(this);
    }

    onCreate() {
        this.setState({ isAddProduct: true });
    }

    onFormSubmit(data) {
        let apiUrl;

        var filterData = {
            table: 'products'
        };

        if (this.state.isEditProduct) {
            apiUrl = 'update';
            filterData.data = "productName = '" + data.productName + "', price = '" + data.price + "', sku = '" + data.sku +"'";
            filterData.where = {
                field: "id = ?", 
                value: [data.id]
            };
            
        } else {
            apiUrl = 'add';
             filterData.data = {
                field: 'productName, price, sku',
                value: [[data.productName, data.price, data.sku]]
            };
        }

       
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(filterData)
        };
        fetch(this.state.url + apiUrl, options)
            .then(res => res.json())
            .then(result => {
                this.setState({
                    response: result,
                    isAddProduct: false,
                    isEditProduct: false
                })
            },
                (error) => {
                    this.setState({ error });
                }
            )
    }

    editProduct = productId => {
        var data = {
            table: 'products',
            where: {
                field: 'id = ?',
                value: [productId]
            }
        };
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };

        fetch(this.state.url + 'select-one', options)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        product: result,
                        isEditProduct: true,
                        isAddProduct: true
                    });
                },
                (error) => {
                    this.setState({ error });
                }
            )
    }

    render() {

        let productForm;
        if (this.state.isAddProduct || this.state.isEditProduct) {
            productForm = <AddProduct onFormSubmit={this.onFormSubmit} product={this.state.product} />
        }

        return (
            <div className="App">
                <Container>
                    <h1 style={{ textAlign: 'center' }}>React Tutorial</h1>
                    {!this.state.isAddProduct && <Button variant="primary" onClick={() => this.onCreate()}>Add Product</Button>}
                    {this.state.response.status === 'success' && <div><br /><Alert variant="info">{this.state.response.message}</Alert></div>}
                    {!this.state.isAddProduct && <ProductList editProduct={this.editProduct} />}
                    {productForm}
                    {this.state.error && <div>Error: {this.state.error.message}</div>}
                </Container>
            </div>
        );
    }
}

export default App;
