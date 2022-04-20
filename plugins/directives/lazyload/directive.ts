export default {
  inserted: (el: HTMLImageElement) => {
    function loadImage() {
      if (el && el.dataset.url) {
        el.src = el.dataset.url
      }
    }

    function handleIntersect(entries: IntersectionObserverEntry[], observer: IntersectionObserver) {
      entries.forEach((entry: IntersectionObserverEntry) => {
        if (entry.isIntersecting) {
          loadImage()
          observer.unobserve(el)
        }
      })
    }

    function createObserver() {
      const options = {
        root: null,
        threshold: 0
      }
      const observer = new IntersectionObserver(handleIntersect, options)
      observer.observe(el)
    }

    // And off we go
    if (el && el.nodeName.toLowerCase() === 'img') {
      if (window.IntersectionObserver) {
        createObserver()
      } else {
        loadImage()
      }
    }
  }
}
