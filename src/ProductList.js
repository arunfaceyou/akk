
import React from 'react';
import { Table, Button, Alert } from 'react-bootstrap';

class ProductList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            products: [],
            response: {},
            url: 'http://localhost:1300/api/'
        }
    }

    componentDidMount() {
        var data = {
            table: 'products'
        };
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)   
        };
        fetch(this.state.url + 'select-all', options)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        products: result
                    });
                },
                (error) => {
                    this.setState({ error });
                }
            )
    }

    deleteProduct(productId) {
        const { products } = this.state;
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
        fetch(this.state.url + 'delete', options)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        response: result,
                        products: products.filter(product => product.id !== productId)
                    });
                },
                (error) => {
                    this.setState({ error });
                }
            )
    }

    render() {
        const { error, products } = this.state;

        if (error) {
            return (
                <div>Error: {error.message}</div>
            )
        } else {
            return (
                <div>
                    <h2>Product List</h2>
                    {this.state.response.message && <Alert variant="info">{this.state.response.message}</Alert>}
                    <Table>
                        <thead>
                            <tr>
                                <th>#ID</th>
                                <th>Product Name</th>
                                <th>SKU</th>
                                <th>Price</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id}>
                                    <td>{product.id}</td>
                                    <td>{product.productName}</td>
                                    <td>{product.sku}</td>
                                    <td>{product.price}</td>
                                    <td>
                                        <Button variant="info" onClick={() => this.props.editProduct(product.id)}>Edit</Button>
                                        &nbsp;<Button variant="danger" onClick={() => this.deleteProduct(product.id)}>Delete</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )
        }
    }
}

export default ProductList;
