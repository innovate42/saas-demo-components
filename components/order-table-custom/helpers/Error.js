import React from "react"

export const Error = ({ icon, text }) => {
  return (
    <div className="customer-orders-body">
      <div className="customer-information-block">
        <div className="customer-information-body">
          <div className="customer-information-row">
            <div className="loading-container full-loading">
              <div className="alert alert-light" role="alert" style={{ width: "100%" }}>
                <h4 style={{ textAlign: "center" }} className="alert-heading">
                  {icon}
                </h4>
                <div style={{ textAlign: "center" }} dangerouslySetInnerHTML={{ __html: text }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
