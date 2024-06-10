export function sendDataLayerEvent(data: DataEvent1) {
    const dataLayerId = getAppConfigValue<string>(["analytics", `data_layer_id`])
    const event = { ...data, event: data.name }
    if (dataLayerId && data) {
      window?.[dataLayerId]?.events?.push(event)
    }
  }