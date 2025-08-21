const burger=document.querySelector('.burger')
const navbarItem=document.querySelector('.navbar')
const nav=document.querySelector('.items')

burger.addEventListener('click',()=>{
    navbarItem.classList.toggle('h-class')
    nav.classList.toggle('v-class')
})