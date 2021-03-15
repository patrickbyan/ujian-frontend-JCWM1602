import axios from 'axios'
import React from 'react'
import linkProducts from '../Supports/Constants/linkProducts'
import linkTransactions from '../Supports/Constants/linkTransactions'
import linkUsers from '../Supports/Constants/linkUsers'

export default class TransactionHistory extends React.Component{

    state = {
        dataTransaction: null,
        detailItems: null,
        dataProducts: null,
        dataUser: null
    }

    componentDidMount(){
        this.getDataTransactions()
    }

    getDataTransactions = () => {
        let idUser = localStorage.getItem('id')

        axios.get(linkUsers + `/${idUser}`)
        .then((res) => {
            axios.get(`http://localhost:2000/transactions?email="${res.data.email}"&_sort=createdAt&_order=desc`)
            // localhost:2000/email=patrickbyann@gmail.com sorted, keluar dataTransaction
            .then((res) => {
                this.setState({dataTransaction: res.data})
            })
            .catch((err) => {
                console.log(err)
            })
        })
        .catch((err) => {
            console.log(err)
        })
    }

    cancelPayment = (idTransaction) => {
        // Mengubah Status belum di bayar menjadi Cancelled
        axios.patch(linkTransactions + `/${idTransaction}`, {status: "Cancelled"})
        .then((res) => {
            this.setState({detailItems: res.data.detailItems})
            this.getDataTransactions()

            // Mengambil dataProducts yang akan diubah stocknya 
            this.state.detailItems.forEach((value, index) => {
                let quantity = value.quantity

                axios.get(linkProducts + `/${value.idProduct}`)
                .then((res) => {
                    let stock = res.data.stock
                    let stockBaru = stock + quantity

                    axios.patch(linkProducts + `/${value.idProduct}`, {stock: stockBaru})
                    .then((res) => {
                        console.log(res)
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                })
                .catch((err) => {
                    console.log(err)
                })
            })
        })
        .catch((err) => {
            console.log(err)
        })
    }  

    render(){
        if(this.state.dataTransaction === null){
            return(
                <div>
                    <div className="container text-center mt-5 height-150 mb-5">
                        <div className="spinner-grow text-warning" style={{width: '3rem', height: '3rem'}} role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                </div>
            )
        }
        return(
            <div className='container mt-3'>
                {
                    this.state.dataTransaction.map((value, index) => {
                        return(
                            <div className="row shadow py-4 mb-4 border border-light" style={{borderRadius: '5px'}} key={index}>
                                <div className="col-4">
                                    <h5 style={{lineHeight: '5px'}}>Status :</h5>
                                    {
                                        value.status === 'Paid'?
                                            <p className="text-success">{value.status} ({value.createdAt})</p>
                                        :
                                            <p className="text-danger">{value.status} ({value.createdAt})</p>
                                    }
                                </div>
                                <div className="col-4 text-center border-left border-right">
                                    <p>
                                        INV/{value.createdAt.split('-')[0]}/{value.createdAt.split('-')[1]}/{value.createdAt.split('-')[2].split(' ')[0]}/{value.id}
                                    </p>
                                </div>
                                <div className="col-4 text-right">
                                    {
                                        value.status === 'belum di bayar'?
                                            <div>
                                                <input type='button' value='Cancel' className='btn btn-danger' onClick={() => this.cancelPayment(value.id)} />
                                            </div>
                                        :
                                            <div className="text-danger font-weight-bold"> 
                                                Cancelled 
                                            </div>  
                                    }  
                                </div>
                                {
                                    value.detailItems.map((value, index) => {
                                        return(
                                            <>
                                                <div className="col-2 mt-3 mb-4" key={index}>
                                                    {/* Image */}
                                                    <img src={value.image} width='100px' height='50px' alt="..." />
                                                </div>
                                                <div className="col-6 mt-3 mb-4">
                                                    {/* Detail Product */}
                                                    <h6 style={{lineHeight: '5px'}}>
                                                        {
                                                            value.name
                                                        }
                                                    </h6>
                                                    <p>
                                                        {value.quantity} Item x Rp.{value.price.toLocaleString('id-ID')}
                                                    </p>
                                                </div>
                                                <div className="col-4 text-right mt-3">
                                                    {/* Total Price Per-Product */}
                                                    <p>
                                                        Total Belanja
                                                    </p>
                                                    <h6>
                                                        Rp.{(value.quantity * value.price).toLocaleString('id-ID')}
                                                    </h6>
                                                </div>
                                                <div className='col-12 border-bottom pb-3'>
                                                </div>
                                            </>
                                        )
                                    })
                                }
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}