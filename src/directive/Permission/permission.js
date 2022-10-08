export default {
  inserted(el, binding) {
    const { value } = binding

    if (!value) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
}
