import React from 'react';
import axios from 'axios';
import linkProducts from '../Supports/Constants/linkProducts'
import Swal2 from 'sweetalert2'
import linkCarts from '../Supports/Constants/linkCarts'

export default class Products extends React.Component{
    state = {
        dataProducts: null,
        showModal: false,
        addToCartSuccess: false,
        isUserLogin: null
    }


    componentDidMount(){
        this.getDataProdutcs()
        this.onCheckUserLogin()
    }

    onCheckUserLogin = () => {
        let id = localStorage.getItem('id')

        if(id){
            this.setState({isUserLogin: true})
        }else{
            this.setState({isUserLogin: false})
        }
    }

    getDataProdutcs = () => {
        axios.get(linkProducts)
        .then((res) => {
            this.setState({dataProducts: res.data})
        })

        .catch((err) => {
            console.log(err)
        })
    }

    errorCart = () => {
        Swal2.fire({
            position: 'top',
            icon: 'error',
            title: 'Anda Harus Login Terlebih Dahulu',
            confirmButtonText: `Login`
        })
        .then((res) => {
            Swal2.fire({
                position: 'top',
                icon: 'info',
                title: 'Redirecting: Login Page',
                showConfirmButton: false,
                timer: 500,
                timerProgressBar: true,
            })
            .then((res) => {
                window.location = "/Login"
            })
        })
    }

    addToCart = (value, stock) => {
        let idProduct = value
        let idUser = localStorage.getItem('id')
        let inputQuantity = Number(prompt('Masukan Quantity'))
        var totalQuantity = 0

        if(inputQuantity){
        axios.get(linkCarts + `?idProduct=${idProduct}`)
        .then((res) => {
            if(res.data.length === 0){
                let result = this.validQuantity(stock, inputQuantity)
                if(result === true){
                    axios.post(linkCarts, {idProduct: idProduct, idUser: idUser, quantity: inputQuantity})
                    .then((res) => {
                        var totalQuantity = Number(localStorage.getItem('TQ'))
                        totalQuantity += res.data.quantity
                        localStorage.setItem('TQ', totalQuantity)
                        Swal2.fire({
                            position: 'top',
                            icon: 'success',
                            title: 'Add to Cart Success',
                            showConfirmButton: false,
                            timer: 1000,
                            timerProgressBar: true,
                        })
                        .then((res) => {
                            this.setState({addToCartSuccess: true})
                            window.location = `/`
                        })
                        
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                }else{
                    alert('melebihi stock')
                }
            }else{
                let qDB = res.data[0].quantity
                let quantity = qDB + inputQuantity

                let result = this.validQuantity(stock, quantity)
                if(result === true){
                    axios.patch(linkCarts + `/${res.data[0].id}`, {quantity: quantity})
                    .then((res) => {
                        axios.get(linkCarts)
                        .then((res) => {
                            for(let i = 0; i < res.data.length; i++){
                                totalQuantity += res.data[i].quantity
                                localStorage.setItem('TQ', totalQuantity)
                            }
                            Swal2.fire({
                                position: 'top',
                                icon: 'success',
                                title: 'Add to Cart Success',
                                showConfirmButton: false,
                                timer: 1000,
                                timerProgressBar: true,
                            }) 
                            .then((res) => {
                                this.setState({addToCartSuccess: true})
                                window.location = `/`
                            })
                            
                        })
                        .catch((err) => {

                        })
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                }else{
                    alert('melebihi stock')
                }
            }
        })
        .catch((err) => {
            console.log(err)
        })
        }
    }

    validQuantity = (stock, inputQuantity) => {
        if(inputQuantity <= stock){
            return true
        }else{
            return false
        }
    }

    render(){
        return(
            <div className="container">
                <div className="row row-cols-1 row-cols-md-4">
                    {
                        this.state.dataProducts?
                            this.state.dataProducts.map((value, index) => {
                                return(
                                    <div className="col mb-4" key={index}>
                                        <div className="card full-radius">
                                            <img src={value.img} className="card-img-top p-3" alt="..."/>
                                            <div className="card-body">
                                                <h6 className="card-title">{value.name}</h6>
                                                <div className="card-text">
                                                    <p className="font-weight-bold">
                                                        Rp. {(value.price).toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="card-text">
                                                    <p className="font-weight-light">
                                                        {value.description}
                                                    </p>
                                                </div>
                                                <div className="card-text bg-white border border-white">
                                                    <small className="text-muted">
                                                        Stock : {value.stock}
                                                    </small>
                                                </div>
                                                <div className="w-100 row align-items-center ml-1 mt-4">
                                                    {
                                                        this.state.isUserLogin === true?
                                                            <div className="cp-clickable-element" onClick={() => this.addToCart(value.id, value.stock)}>
                                                                <div className="w-100 col-12 btn btn-warning">Add to Cart</div>
                                                            </div>
                                                        :
                                                        <div className="cp-clickable-element" onClick={this.errorCart}>
                                                            <div className="w-100 col-12 btn btn-warning">Add to Cart</div>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        :
                            null
                    }
                </div>
            </div>
        )
    }
}