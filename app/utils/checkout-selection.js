const CHECKOUT_SESSION_KEY = 'vicast_checkout_selection'
const CHECKOUT_SELECTION_TTL = 10 * 60 * 1000

const parseCheckoutSelection = (value) => {
  try {
    const selection = JSON.parse(String(value || ''))

    if (!selection || typeof selection !== 'object' || Number(selection.expiresAt) < Date.now()) {
      return null
    }

    return selection.plan && typeof selection.plan === 'object' ? selection.plan : null
  } catch {
    return null
  }
}

export const saveCheckoutSelection = (plan = {}) => {
  if (!process.client) {
    return
  }

  window.sessionStorage.setItem(CHECKOUT_SESSION_KEY, JSON.stringify({
    expiresAt: Date.now() + CHECKOUT_SELECTION_TTL,
    plan,
  }))
}

export const loadCheckoutSelection = () => {
  if (!process.client) {
    return null
  }

  return parseCheckoutSelection(window.sessionStorage.getItem(CHECKOUT_SESSION_KEY))
}
