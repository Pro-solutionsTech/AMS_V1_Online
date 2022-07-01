import React from 'react';
import styles2 from "./VoucherApprovalModal.module.css";
function VoucherApprovalModal(props) {
  return <div>
<div className={styles2.container} >
          <div className={styles2.modal} >

        
            <div className={styles2.row} >
              <div className={styles2.column1}>
                <div></div>
                <div>
                  <div className={styles2.grid}>
                    <div> </div>
                    <div>
                      {" "}
                      <h1 className = {styles2.title}>VOUCHER DETAILS</h1>
                    </div>
                    <div>
                      {" "}
                      <button
                        className={styles2.btn_close}
                        onClick = {()=> props?.setOpenDesign(false)}
                       >
                        {" "}
                        &#10005;
                      </button>
                    </div>
                  </div>

                
                </div>
              
              </div>

         
              <div className={styles2.column2} >
                 <div className = {styles2}>
                            <br />
                    <div className={styles2.textDiv}>
                        <label>
                              Requisition #: CV - 00123 <br />
                              Category: CV - CASH VOUCHER
                        </label>
                        <br />
                        <br />
                        <label>
                              Requested by: DELA CRUZ, JUAN , Team Lean - Tech Department
                         <br />
                             Supplier: PLDT - Sta. Mesa, Manila - 0912-346-6698
                         <br />   
                         Check No. 
                         <br />
                         Bank:
                        </label>
                          <br />
                          <br />
                        <label>
                               Descriptions : 
                               <br />
                                Network Infrastructure Device.
                        </label>
                        <br /><br />
                        <label>
                                Total Item: 2
                        </label>
                        <br />
                        <label>
                                Total Amount: 2,500.00
                        </label>

                    </div>
                 
                  
                    
                 </div>
              </div>
               
                   <button className = {styles2.approvedBTN}><span>APPROVED</span></button>
                    <button className = {styles2.approvedBTN}><span>APPROVED & PRINT</span></button>
                    <br /><br /><br />
            </div>
            
          </div>
        </div>

  </div>;
}

export default VoucherApprovalModal;
