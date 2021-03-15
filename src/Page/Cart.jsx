import react from 'react'
import axios from 'axios'
import Swal2 from 'sweetalert2'
import linkCarts from '../Supports/Constants/linkCarts'
import linkProducts from '../Supports/Constants/linkProducts'
import linkTransactions from '../Supports/Constants/linkTransactions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom'
import { faMinusCircle, faPlusCircle, faTrashAlt } from '@fortawesome/free-solid-svg-icons'

import linkUsers from '../Supports/Constants/linkUsers'

export default class Cart extends react.Component{
    state = {
        dataCarts: null,
        dataProducts: null,
        dataUsers: null,
        totalItem: 0,
        totalPrice: 0
    }

    componentDidMount(){
        this.getDataCarts()
        this.getDataUsers()
    }

    getDataUsers = () => {
        let idUser = localStorage.getItem('id')

        axios.get(linkUsers + `/${idUser}`)
        .then((res) => {
            this.setState({dataUsers: res.data})
        })
        .catch((err) => {
            console.log(err)
        })
    }

    getDataCarts = () => {
        let id = localStorage.getItem('id')

        axios.get(linkCarts + `?idUser=${id}`)
        .then((res) => {
            let urlProduct = ''

            res.data.forEach((value, index) => {
                urlProduct += `id=${value.idProduct}&`
            })

            res.data.sort((a, b) => {
                return a.idProduct - b.idProduct
            })

            this.setState({dataCarts: res.data})

            if(res.data.length === 0){
                localStorage.removeItem('TQ')
            }

            axios.get(linkProducts + `?${urlProduct}`)
            .then((res) => {
                this.setState({dataProducts: res.data})
                this.getOrderSummary()
            })

            .catch((err) => {
                console.log(err)
            })
        })
        .catch((err) => {
            console.log(err)
        })
    }

    getOrderSummary = () => {
        let totalItem = 0
        let totalPrice = 0

        this.state.dataCarts.forEach((value, index) => {
            totalItem += value.quantity
            totalPrice += this.state.dataProducts[index].price * value.quantity
        })

        this.setState({totalItem: totalItem, totalPrice: totalPrice})
    }

    updateQuantityProduct = (button, idCart, quantity) => {
        let quantitySebelumnya = quantity
        let quantityTerbaru = 0

        if(button === 'Plus'){
            quantityTerbaru = quantitySebelumnya + 1
        }else{
            quantityTerbaru = quantitySebelumnya -1
        }

        axios.patch(linkCarts + `/${idCart}`, {quantity: quantityTerbaru})
        .then((res) => {
            if(res.status === 200){
                this.getDataCarts()
            }
        })
        .catch((err) => {
            console.log(err)
        })
    }

    SwalExceedingStock = () => {
        Swal2.fire({
            position: 'top',
            icon: 'error',
            title: 'Jumlah Quantity Melebihi Stock!!',
            confirmButtonText: `Saya Mengerti`
        })
    }

    deleteProduct = (idCart) => {
        Swal2.fire({
            title: 'Are you sure?',
            text: "Are you sure want to delete this product?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          })

          .then((result) => {
              if (result.isConfirmed) {
                axios.delete(linkCarts + `/${idCart}`)
                Swal2.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                )
                .then((res) => {
                    window.location = "/Cart"
                    this.getDataCarts()
                })
            }
        })
    }

    createTransaction = () => {
    Swal2.fire({
        title: 'Are you sure?',
        text: "Apakah anda ingin melakukan checkout?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Konfirmasi'
        })
        .then((result) => {
            if (result.isConfirmed) {
                Swal2.fire(
                'Confirmed',
                'Checkout Berhasil!',
                'success'
                )
            }
            // remove TQ from locale storage
            localStorage.removeItem('TQ')
            // Get Data User
            let detailUsers = {
                idUser: this.state.dataUsers.id,
                email: this.state.dataUsers.email
            }

            // Get Date
            let date = new Date()
            date = date.toString()

            let newDate = date.split(' ')[2] + '-' + date.split(' ')[1] + '-' + date.split(' ')[3] + ' ' + date.split(' ')[4]

            // Get Total Price: didapat dari state
            let totalPrice = this.state.totalPrice

            // Get Detail Items
            let detailItems = this.state.dataCarts.map((value, index) => {
                return{
                    idProduct: this.state.dataProducts[index].id,
                    name: this.state.dataProducts[index].name,
                    image: this.state.dataProducts[index].img,
                    price: this.state.dataProducts[index].price,
                    quantity: value.quantity
                }
            })

            const dataToSend = {
                detailUser: detailUsers,
                status: 'belum di bayar',
                createdAt: newDate,
                total: totalPrice,
                detailItems: detailItems
            }
            
            // create transaction 
            axios.post(linkTransactions, dataToSend)
            .then((res) => {
                this.state.dataCarts.forEach((value, index) => {
                    let stock = this.state.dataProducts[index].stock
                    let stockBaru = stock - value.quantity

                    axios.patch(linkProducts + `/${value.idProduct}`, {stock: stockBaru})
                    .then((res) => {
                        // Setelah berhasil, delete data carts
                        axios.delete(linkCarts + `/${value.id}`)
                        .then((res) => {
                            this.getDataCarts()
                            window.location = '/transaction-history'
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                    })
                })
            })
            .catch((err) => {
                console.log(err)
            })
        })
    }
    render(){
        if(this.state.dataCarts === null || this.state.dataProducts === null){
            return(
                null
            )
        }
        return(
            <div className="container text-dark">
                <div className="row"> 
                    <div className="card mb-3 col-7 border border-white shadow mt-3">.
                        <div className="text-start h5">
                            Keranjang
                        </div>
                        <hr style={{borderWidth: '5px'}}/>
                            {
                                this.state.dataCarts.length === 0?
                                    <div className="col-md-8 text-warning font-weight-normal cp-font-size-14">
                                        Anda belum belanja apa-apa! 
                                        <span className="ml-2 font-weight-bold text-warning cp-link">
                                            <Link to = "/" className="text-decoration-none text-warning cp-link">
                                                Klik untuk berbelanja
                                            </Link>
                                        </span>
                                    </div>
                                :  
                                    null
                            }
                            <div className="row no-gutters">
                                {
                                    // this.state.dataCarts?
                                        this.state.dataCarts.map((value, index) => {
                                            return(
                                                <>
                                                    <div className="col-md-4" >
                                                        <img src={this.state.dataProducts[index].img} class="mw-100 p-3" alt="..." />
                                                    </div>
                                                    <div className="col-md-8">
                                                        <div className="card-body">
                                                            <h5 className="card-title text-uppercase cp-font-size-14 font-weight-normal">{this.state.dataProducts[index].name}</h5>
                                                            <div className="card-text">
                                                                <p className="font-weight-bold">
                                                                    Rp. {(this.state.dataProducts[index].price).toLocaleString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12 row pl-3 justify-content-between">
                                                        <div className="col-md-8 text-warning font-weight-normal cp-font-size-14">
                                                            Tulis catatan untuk barang ini
                                                        </div>
                                                        <div className="col-md-4 text-end">
                                                            <FontAwesomeIcon icon={ faTrashAlt } className="text-muted cp-font-size-20 w-25 font-weight-lighter mr-4" onClick={() => this.deleteProduct(value.id)} />
                                                            {
                                                                value.quantity === 1?
                                                                    <FontAwesomeIcon icon={ faMinusCircle } className="cp-font-size-20 text-warning font-weight-lighter" />
                                                                :
                                                                    <FontAwesomeIcon icon={ faMinusCircle } className="cp-font-size-20 text-warning font-weight-lighter" onClick={() => this.updateQuantityProduct('Minus', value.id, value.quantity)} />
                                                            }
                                                            <span className="px-4 border-bottom border-dark">
                                                                {value.quantity}
                                                            </span>
                                                            {
                                                                value.quantity === this.state.dataProducts[index].stock?
                                                                <FontAwesomeIcon icon={ faPlusCircle } className="cp-font-size-20 text-warning font-weight-lighter" onClick={() => this.SwalExceedingStock()} />
                                                                :
                                                                <FontAwesomeIcon icon={ faPlusCircle } className="cp-font-size-20 text-warning font-weight-lighter" onClick={() => this.updateQuantityProduct('Plus', value.id, value.quantity)} />
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="col-12">
                                                        <hr style={{borderWidth: '5px'}}/>
                                                    </div>
                                                </>
                                            )
                                        })
                                //     :
                                        
                                }
                            </div>
                    </div>
                    <div className="col-4 container ml-5">
                        <div className="mt-3 text-nowrap">
                            <div className="row border pr-2 shadow" style={{borderRadius: '10px'}}>
                                <div className="col-12 h5 pt-3 text-dark">
                                    <b>Ringkasan belanja</b>
                                </div>
                                <div className="col-12">
                                    <hr style={{borderWidth: '5px'}} />
                                </div>
                                <div className="col-12">
                                    <div className="row text-muted cp-font-size-14 pt-3 text-dark">
                                        <div className="col-7">
                                            Total Harga ({this.state.totalItem} barang)
                                        </div>
                                        <div className="col-5">
                                            Rp. {this.state.totalPrice.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <hr style={{borderWidth: '1px', width: '260px'}}/>
                                </div>
                                <div className="col-12">
                                    <div className="row font-weight-bold h6 text-dark">
                                        <div className="col-7">
                                            Total Harga
                                        </div>
                                        <div className="col-5">
                                            Rp. {this.state.totalPrice.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                                <button type="button" disabled={this.state.totalItem > 0? false : true} 
                                        className="btn btn-warning col-11 ml-3 my-3 height-40 font-weight-bolder text-white cp-font-size-18 half-radius" 
                                        onClick={this.createTransaction}
                                >
                                    Checkout ({this.state.totalItem})
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}