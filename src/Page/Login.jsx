import react from 'react'
import axios from 'axios'
import Swal2 from 'sweetalert2'

import linkUsers from '../Supports/Constants/linkUsers'
import ValidEmail from '../Supports/Functions/ValidEmail'
import ValidPassword from '../Supports/Functions/ValidPassword'

export default class Login extends react.Component{
    state = {
        error: null,
        errorEmail: null,
        errorPassword: null
    }

    componentDidMount(){
        if(localStorage.getItem('id')){
            Swal2.fire({
                position: 'top',
                icon: 'info',
                title: 'You must do log out first!',
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: true,
            })
            .then((res) => {
                window.location = "/"
            })
        }
    }

    validInput = () => {
        let inputEmail = this.refs.inputEmail.value
        let inputPassword = this.refs.inputPassword.value

        let resultEmail = ValidEmail(inputEmail)
        this.setState({errorEmail: resultEmail})

        let resultPassword = ValidPassword(inputPassword)
        this.setState({errorPassword: resultPassword})

        if(resultEmail === 'berhasil' && resultPassword === 'berhasil'){
            this.setState({error: 'You`re all set!'})
        }else{
            this.setState({error: null})
        }
    }

    onRegister = () => {
        let inputEmail = this.refs.inputEmail.value
        let inputPassword = this.refs.inputPassword.value

        if(this.state.error !== null){
            axios.post(linkUsers, {email: inputEmail, password: inputPassword})
            .then((res) => {
                this.onLogin()
            })
            .catch((err) => {

            })
        }else{
            alert('email dan password = panjang 6 katakter dan harus mengandung angka!')
        }
    }

    onLogin = () => {
        let inputEmail = this.refs.inputEmail.value
        let inputPassword = this.refs.inputPassword.value

        axios.get(linkUsers + `?email=${inputEmail}&password=${inputPassword}`)
        .then((res) => {
            // console.log(res)
            if(res.data.length === 1){
                Swal2.fire({
                    position: 'top',
                    icon: 'success',
                    title: 'Login Success!',
                    showConfirmButton: false,
                    timer: 1000,
                    timerProgressBar: true,
                })
                .then((res) => {
                    this.setState({error: null})
                    window.location = '/'
                })
                localStorage.setItem('id', res.data[0].id)
            }else{
                this.validInput()
                this.onRegister()
            }
        })
        .catch((err) => {
            console.log(err)
        })
    }

    render(){
        return(
            <div className="container">
                <form className="mt-5">
                    <div className="form-group row align-items-center">
                        <p className="col-4 col-form-label">Email</p>
                        <div className="col-4">
                            <input type="text" ref="inputEmail" className="form-control" id="inputEmail" onChange={this.validInput} />
                        </div>
                        <p className="col-4 col-form-label text-danger">
                            {
                                this.state.errorEmail?
                                    this.state.errorEmail
                                :
                                    null
                            }
                        </p>
                    </div>
                    <div className="form-group row">
                        <p className="col-4 col-form-label">Password</p>
                        <div className="col-4">
                            <input type="password" ref="inputPassword" className="form-control" id="inputPassword" onChange={this.validInput} />
                        </div>
                        <p className="col-4 col-form-label text-danger">
                            {
                                this.state.errorPassword?
                                    this.state.errorPassword
                                :
                                    null
                            }
                        </p>
                    </div>
                    <div className="form-group row">
                        <p className="col-12 col-form-label text-danger">
                            {
                                this.state.error?
                                    this.state.error
                                :
                                    null
                            }
                        </p>
                    </div>
                    <div className="form-group row">
                        <div className="col-9">
                            <button type="button" className="btn btn-primary" onClick={this.onLogin}>Login</button>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
} 