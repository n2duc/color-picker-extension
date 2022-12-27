const colorPickerBtn = document.querySelector('#color-picker')
const colorList = document.querySelector('.all-colors')
const clearAll = document.querySelector('.clear-all')
const pickedColors = JSON.parse(localStorage.getItem('picked-colors') || '[]')

const copyColor = (elem) => {
    //Copy the color to clipboard without #
    navigator.clipboard.writeText(elem.dataset.color.replace('#', ''))
    elem.innerText = 'Copied'
    setTimeout(() => {
        //Chage text before 1 second
        elem.innerText = elem.dataset.color
    }, 1000)
}

//Show selected colors in box
const showColors = () => {
    if (!pickedColors.length) return; //Returning if there are no picked colors
    colorList.innerHTML = pickedColors.map((color) => `
        <li class="color">
            <span class="rect" style="background: ${color}"></span>
            <span class="value" data-color="${color}" >${color}</span>
        </li>
        `
    ).join("") //Generating li for the picked color and adding it to the colorList

    //Remove class hidden in element picked-colors
    document.querySelector('.picked-colors').classList.remove('hidden')

    //Add a click event listener to each collor element to copy the color code
    document.querySelectorAll('.color').forEach(li => {
        li.addEventListener('click', e => copyColor(e.currentTarget.lastElementChild))
    })
}
showColors()
const activateEyeDropper = () => {
    document.body.style.display = 'none'
    setTimeout(async () => {
        try {
            //Open the eye dropper and getting the selected color
            const eyeDropper = new EyeDropper()
            const { sRGBHex } = await eyeDropper.open()
            navigator.clipboard.writeText(sRGBHex)
    
            //Adding the color to the list if it doesn't already exist
            if (!pickedColors.includes(sRGBHex)) {
                //Push color to localStorage
                pickedColors.push(sRGBHex)
                localStorage.setItem('picked-colors', JSON.stringify(pickedColors))
                //Show color
                showColors()
            }
        } catch (error) {
            console.log('Failed to copy the color code!');
        }
        document.body.style.display = 'block'
    }, 10)
}

//Clear all color picked function and updating localStorage
const clearAllColors = () => {  
    pickedColors.length = 0;
    localStorage.setItem('picked-colors', JSON.stringify(pickedColors))
    //Add class hidden when picked colors is empty
    document.querySelector('.picked-colors').classList.add('hidden')
}

colorPickerBtn.addEventListener('click', activateEyeDropper);
clearAll.addEventListener('click', clearAllColors);