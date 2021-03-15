function ValidEmail(inputEmail){
    let splitEmail = inputEmail.split('@')
    let namaEmail = splitEmail[0]

    if(inputEmail){
        if(namaEmail.length <= 6) return false

        for(let i = 0; i < inputEmail.length; i++){
            if(inputEmail[i] >= 0) return 'berhasil'
        }
    }
    
    return true
}

export default ValidEmail