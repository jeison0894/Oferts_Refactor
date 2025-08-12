document.addEventListener('DOMContentLoaded', async () => {
   localStorage.removeItem('productosData')
   localStorage.removeItem('productosTimestamp')

   const DATA_URL = './scripts/data.json'
   const navMenu = document.querySelector('.nav')
   const seoContainer = document.querySelector('.seo')
   const skeletonContainer = document.querySelector('.skeleton-container')
   const productContainer = document.querySelector('.categorias-container')
   const productTemplate = document.querySelector('#template')

   const createSkeleton = () => {
      const skeleton = document.createElement('div')
      skeleton.className = 'skeleton'
      skeleton.innerHTML = `
         <div class="skeleton-image"></div>
         <div class="skeleton-text"></div>
      `
      return skeleton
   }

   const showSkeletons = () => {
      const isMobile = window.innerWidth <= 768
      const skeletonCount = isMobile ? 18 : 12
      skeletonContainer.innerHTML = ''
      for (let i = 0; i < skeletonCount; i++) {
         skeletonContainer.appendChild(createSkeleton())
      }
   }

   const highlightText = (text) => {
      return text.replace(
         /(\d+%|ofertas|\$\d{1,3}(\.\d{3})*(,\d+)?|\d+\s*(ml|ML)|ENVÍO\sGRATIS)/gi,
         (match) =>
            `<span class="categorias-span" style="font-weight: bold; color: red;">${match}</span>`
      )
   }

   const getTagStyles = (state) => {
      const upperState = state?.toUpperCase()

      if (!state) {
         return {
            borderColor: '#dfdfdf',
            bgColor: 'transparent',
            textColor: 'black',
            text: '',
            borderWidth: '1px',
         }
      }

      if (/SOLO X \d+ HORAS/i.test(state) || upperState === 'AGOTADO') {
         return {
            borderColor: 'red',
            bgColor: 'red',
            textColor: 'white',
            text: upperState,
            borderWidth: '3px',
         }
      }

      if (upperState === 'LANZAMIENTO') {
         return {
            borderColor: '#aad500',
            bgColor: '#aad500',
            textColor: 'black',
            text: 'LANZAMIENTO',
            borderWidth: '3px',
         }
      }

      return {
         borderColor: '#dfdfdf',
         bgColor: 'transparent',
         textColor: 'black',
         text: '',
         borderWidth: '1px',
      }
   }

   const renderProducts = (products) => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      productContainer.innerHTML = ''
      const fragment = document.createDocumentFragment()

      const hasLimitedTime = products.some((p) =>
         /SOLO X \d+ HORAS/i.test(p.offerState)
      )
      if (
         hasLimitedTime &&
         !document.querySelector('[data-category-name="SoloX"]')
      ) {
         const soloXLink = document.createElement('a')
         soloXLink.href = '#SoloX'
         soloXLink.className = 'nav-item'
         soloXLink.dataset.categoryName = 'SoloX'
         soloXLink.textContent = 'Solo X Horas'
         navMenu.appendChild(soloXLink)
      }

      products
         .filter((p) => {
            const start = new Date(p.startDate)
            const end = new Date(p.endDate)
            return !p.isProductHidden && today >= start && today <= end
         })
         .sort((a, b) => a.orderSellout - b.orderSellout)
         .forEach((product) => {
            const styles = getTagStyles(product.offerState)
            const clone = productTemplate.content.cloneNode(true)

            const link = clone.querySelector('.template__link')
            const img = clone.querySelector('.template__image')
            const title = clone.querySelector('.template__title')
            const tagDesktop = clone.querySelector('.template__tag--desk')
            const tagMobile = clone.querySelector('.template__tag--mobile')

            link.href = product.urlProduct
            link.dataset.id = product.id
            link.dataset.title = product.title
            link.dataset.category = /SOLO X \d+ HORAS/i.test(product.offerState)
               ? `${product.category} SoloX`
               : product.category

            img.src = product.urlImage
            img.alt = product.title || 'Product Image'
            img.style.border = `${styles.borderWidth} solid ${styles.borderColor}`
            title.innerHTML = highlightText(product.title || '')

            if (styles.text) {
               tagDesktop.style.backgroundColor = styles.bgColor
               tagDesktop.style.color = styles.textColor
               tagDesktop.innerHTML = `<b class="template__tag--bold">${styles.text}</b>`

               tagMobile.style.backgroundColor = styles.bgColor
               tagMobile.style.color = styles.textColor
               tagMobile.innerHTML = `<b class="template__tag--bold">${styles.text}</b>`
            } else {
               tagDesktop.remove()
               tagMobile.remove()
            }

            fragment.appendChild(clone)
         })

      productContainer.appendChild(fragment)
      
      navMenu.style.opacity = '0'
      navMenu.style.display = 'flex'
      seoContainer.style.display = 'block'

      setTimeout(() => {
         productContainer.classList.add('categorias-container--show')
         navMenu.style.transition = 'opacity 0.5s ease-in-out'
         navMenu.style.opacity = '1'
         document.dispatchEvent(new Event('navLoaded'))
      }, 100)
   }

   const fetchProducts = async () => {
      try {
         showSkeletons()
         const response = await fetch(DATA_URL)
         const data = await response.json()

         if (!Array.isArray(data)) {
            console.error('Invalid product data:', data)
            return
         }

         skeletonContainer.style.display = 'none'
         renderProducts(data)
      } catch (error) {
         console.error('Failed to fetch product data:', error)
      }
   }

   await fetchProducts()
})
