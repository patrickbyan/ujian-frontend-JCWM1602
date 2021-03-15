function ValidEmail(inputEmail){
    let splitEmail = inputEmail.split('@')
    let namaEmail = splitEmail[0]
    
    if(inputEmail){
        if(namaEmail.length <= 6){
            console.log('kurang dr 6')
        }

        for(let i = 0; i < namaEmail.length; i++){
            if(!(namaEmail[i] >= 0)){
                console.log(`${namaEmail[i]} false`)
            }else if(namaEmail[i] >= 0){
                console.log(`${namaEmail[i]} true`)

                break
            }
        }

        // i = 0 --> p --> string? true = false
        // j = 0 --> p --> number? false = false
        // i = 1 --> a --> string? true = false
        // j = 1 --> a --> number? false = false
        // i = 2 --> t --> string? true = false
        // j = 2 --> t --> number? false = false
        // i = 3 --> 2 --> string? false = false
        // j = 3 --> 2 --> number? true = end



        // 0 --> str 
        // 1 --> str false
        // 2 --> number true
    }
}

// ValidEmail('gypatb@hotmail.com')
// ValidEmail('patrickbyann@gmail.com')
// ValidEmail('patrickbyan23@gmail.com')
ValidEmail('patrick23byann@gmail.com')
ValidEmail('23patrickbyann@gmail.com')