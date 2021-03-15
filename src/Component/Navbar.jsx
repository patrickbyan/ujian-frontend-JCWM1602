import { faShoppingBag } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import react from 'react'
import { Link } from 'react-router-dom'
import Swal2 from 'sweetalert2'
import linkCarts from '../Supports/Constants/linkCarts'

import linkUsers from '../Supports/Constants/linkUsers'


export default class Navbar extends react.Component{
    state = {
        id: localStorage.getItem('id'),
        email: null,
        totalQuantity: 0
    }

    componentDidMount(){
        let id = this.state.id
        // console.log(id)

        axios.get(linkUsers + `/${id}`)
        .then((res) => {
            this.setState({email: res.data.email})
            // console.log(this.state.email)
        })
        .catch((err) => {
            console.log(err)
        })
        
        axios.get(linkCarts + `/${id}`)
        .then((res) => {
            if(res.data.length !== 0){
                this.setState({totalQuantity: localStorage.getItem('TQ')}) 
            }else{
                this.setState({totalQuantity: null})
            }
        })
        .catch((err) => {

        })
    }

    onLogout = () => {
        let id = this.state.id
        
        if(id){
            localStorage.removeItem('id')
            Swal2.fire({
                position: 'top',
                icon: 'success',
                title: 'Logout success',
                showConfirmButton: false,
                timer: 500,
                timerProgressBar: true,
            })
            .then((res) => {
                window.location = '/'
            })

        }
    }

    mapEmail = () => {
        let email = this.state.email
        let showEmail = ''
        
        for(let i = 0; i < 10; i++){
            showEmail += email[i]
        }

        showEmail += '...'

        return showEmail
    }

    render(){
        return(
            <div className="container sticky-top" style={{height: '50px'}}>
                <div className="row">
                    <div className="col-4">
                        <Link to = '/' className="ml-3">
                            Home
                        </Link>
                        <Link to ='/Login' className="ml-3">
                            Login
                        </Link>
                        <Link to ='/transaction-history' className="ml-3">
                            Transaction History
                        </Link>
                    </div>
                    <div className="col-8 text-right">
                        {
                            this.state.email?
                                `welcome ${this.mapEmail()}`
                            :
                                null
                        }
                        {
                            this.state.id?
                                <Link to ='/' className="ml-3" onClick={this.onLogout}>
                                    Logout
                                </Link>
                            :
                            null
                        }
                        <span className="ml-3 position-relative">
                            <Link to="/Cart">
                                <FontAwesomeIcon icon={ faShoppingBag } className="fa-lg cp-clickable-element cp-link text-decoration-none text-dark"/>
                                    {
                                        this.state.id?
                                                <div className="badge badge-pill badge-danger border border-light position-absolute" style={{position: 'absolute', top: '-5px', left: '13px'}}>
                                                    {
                                                        this.state.totalQuantity?
                                                            this.state.totalQuantity
                                                        :
                                                            null
                                                    }
                                                </div>
                                        :
                                            <div className="badge badge-pill badge-danger border border-light position-absolute" style={{position: 'absolute', top: '-5px', left: '13px'}}>
                                            
                                            </div>

                                    }
                            </Link>
                        </span>
                    </div>
                </div>
            </div>
        )
    }
}