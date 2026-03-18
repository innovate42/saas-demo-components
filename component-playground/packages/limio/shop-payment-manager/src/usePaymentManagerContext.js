import { useRef } from "react"

function createMockStore() {
  let state = { order: { paymentType: null } }
  const listeners = new Set()

  return {
    getState: () => state,
    dispatch: (action) => {
      console.log("store.dispatch:", action)
      if (action.type === "SET_ORDER_PAYMENT_TYPE") {
        state = { ...state, order: { ...state.order, paymentType: action.payload } }
        listeners.forEach(fn => fn())
      }
    },
    subscribe: (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    }
  }
}

export function usePaymentManagerContext() {
  const storeRef = useRef(null)
  if (!storeRef.current) {
    storeRef.current = createMockStore()
  }

  return {
    form: {
      addAsyncEventListener: () => {},
      removeAsyncEventListener: () => {},
      reportValidity: () => true,
      requestSubmit: () => {}
    },
    store: storeRef.current
  }
}
