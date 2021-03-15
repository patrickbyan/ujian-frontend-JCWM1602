function ValidPassword(inputPassword){
    if(inputPassword.length <= 6) return 'jumlah karakter password harus lebih dari 6'

    for(let i = 0; i < inputPassword.length; i++){
        if(inputPassword[i] >= 0) return 'berhasil'
    }

    return true
}

export default ValidPassword