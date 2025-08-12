document.addEventListener('navLoaded', () => {
   const nav = document.querySelector('.nav')
   const navItems = document.querySelectorAll('.nav-item')
   const productLinks = document.querySelectorAll('.template__link')
   const banner = document.querySelector('.banner')
   const viewAllButton = document.querySelector(
      '[data-category-name="VerTodo"]'
   )

   const showAllProducts = () => {
      productLinks.forEach((product) => {
         product.style.display = 'block'
      })
   }

   const filterByCategory = (category) => {
      productLinks.forEach((product) => {
         const productCategoryAttr = product.getAttribute('data-category') || ''
         const productCategories = productCategoryAttr.split(' ')
         product.style.display = productCategories.includes(category)
            ? 'block'
            : 'none'
      })
   }

   showAllProducts()

   navItems.forEach((item) => {
      item.addEventListener('click', (event) => {
         event.preventDefault()
         const selectedCategory = item.getAttribute('data-category-name')

         navItems.forEach((navItem) =>
            navItem.classList.remove('nav-item--selected', 'nav-item--view-all')
         )

         if (selectedCategory === 'VerTodo') {
            showAllProducts()
            item.classList.add('nav-item--view-all')
         } else {
            filterByCategory(selectedCategory)
         }

         item.classList.add('nav-item--selected')

         nav.scrollTo({
            left: item.offsetLeft - nav.offsetLeft,
            behavior: 'smooth',
         })
      })
   })

   banner.addEventListener('click', () => {
      showAllProducts()
      
      navItems.forEach((item) =>
         item.classList.remove('nav-item--selected', 'nav-item--view-all')
      )

      viewAllButton.classList.add('nav-item--selected', 'nav-item--view-all')
      nav.scrollTo({
         left: viewAllButton.offsetLeft - nav.offsetLeft,
         behavior: 'smooth',
      })
   })
})
