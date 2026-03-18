export function usePaymentManagerContext() {
  return {
    form: {
      addAsyncEventListener: () => {},
      removeAsyncEventListener: () => {},
      reportValidity: () => true,
      requestSubmit: () => {}
    },
    store: {
      getState: () => ({ order: {} }),
      dispatch: (action) => console.log("store.dispatch:", action)
    }
  }
}
