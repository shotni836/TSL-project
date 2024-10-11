import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Dailyproductionreport.css';

import tatasteellogo from "../../assets/images/tsl-blue-logo.png";
import tatalogo from "../../assets/images/tata-blue-logo.png";
import qcsignature from './qc.png';
import tpisignature from './tpi.png';
import tqasignature from './qa.png';
import tatastamp from './Stamps.png';
import axios from "axios";
import Environment from "../../environment";

function Dailyproductionreport() {

  const [dprHeader, setDprHeader] = useState({});
  const [dprDetail, setDprDetail] = useState([]);
  const [dprFooter, setDprFooter] = useState({});

  useEffect(() => {
    const fetchData = async () => {
        try {
                const response = await axios.get(`${Environment.BaseAPIURL}/api/User/Get_DPRReport`);
                const data = response.data[0];
                setDprHeader(data._DPRHeader[0] || {});
                setDprDetail(data._DPRDetail[0] || []);
                setDprFooter(data._DPRFooter[0] || []);
        } catch (error) {
            console.error('Error fetching report data:', error);
        }
    };
    fetchData();
}, []);

  return (
    <div>
      <div className='InspReportSection DPRPageSection'>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-md-12 col-sm-12 col-xs-12'>
              <div className='InspReportBox'>
                <section className="HeaderDataSection">
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-md-12 col-sm-12 col-xs-12">
                        <div className="HeaderDataFlexdisplay">
                          <img className="tatasteellogoimg" src={tatasteellogo} alt="Tata Steel Logo" />
                          <img className="tatalogoimg" src={tatalogo} alt="Tata Logo" />
                        </div>
                      </div>
                      <div className="col-md-12 col-sm-12 col-xs-12">
                        <h1> PIPE COATING DIVISION <br /> {dprHeader.formatDesc || "-"}</h1>
                      </div>
                      <div className="col-md-12 col-sm-12 col-xs-12">
                        <div style={{ textAlign: "right" }}>
                          <p>FORMAT NO.: {dprHeader.formatno} REV. {dprHeader.revision} DATE: {dprHeader.formatdate?.split('T')[0]} </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section className='Reportmasterdatasection'>
                  <div className='container-fluid'>
                    <form className='row'>
                      <div className='col-md-7 col-sm-6 col-xs-12'>
                        <div className='form-group'>
                          <label htmlFor="">CLIENT</label>
                          <h4>: &nbsp;&nbsp; {dprHeader.client || "-"}</h4>
                        </div>
                      </div>
                      <div className='col-md-5 col-sm-6 col-xs-12'>
                        <div className='form-group'>
                          <label htmlFor="">DPR NO.</label>
                          <h4>: &nbsp;&nbsp; {dprHeader.dprNo || "-"}</h4>
                        </div>
                      </div>
                      <div className='col-md-7 col-sm-6 col-xs-12'>
                        <div className='form-group'>
                          <label htmlFor="">PMC</label>
                          <h4>: &nbsp;&nbsp; {dprHeader.pmc || "-"}</h4>
                        </div>
                      </div>
                      <div className='col-md-5 col-sm-6 col-xs-12'>
                        <div className='form-group'>
                          <label htmlFor="">PRODUCTION DATE</label>
                          <h4>: &nbsp;&nbsp; {dprHeader.productionDate || "-"}</h4>
                        </div>
                      </div>
                      <div className='col-md-7 col-sm-6 col-xs-12'>
                        <div className='form-group'>
                          <label htmlFor="">TYPE OF COATING</label>
                          <h4>: &nbsp;&nbsp; {dprHeader.typeofcoating || "-"}</h4>
                        </div>
                      </div>
                      <div className='col-md-5 col-sm-6 col-xs-12'>
                        <div className='form-group'>
                          <label htmlFor="">REPORTING DATE</label>
                          <h4>: &nbsp;&nbsp; {dprHeader.reportingDate || "-"}</h4>
                        </div>
                      </div>
                      <div className='col-md-7 col-sm-6 col-xs-12'>
                        <div className='form-group'>
                          <label htmlFor="">PO NO.</label>
                          <h4>: &nbsp;&nbsp; {dprHeader.pono || "-"}</h4>
                        </div>
                      </div>
                      <div className='col-md-5 col-sm-6 col-xs-12'>
                        <div className='form-group'>
                          <label htmlFor="">QAP NO:-</label>
                          <h4>: &nbsp;&nbsp; {dprHeader.qapNo || "-"}</h4>
                        </div>
                      </div>

                      <div className='col-md-7 col-sm-6 col-xs-12'>
                        <div className='form-group'>
                          <label htmlFor="">PIPE SIZE (mm)</label>
                          <h4>: &nbsp;&nbsp; {dprHeader.pipeSize || "-"}</h4>
                        </div>
                      </div>
                      <div className='col-md-5 col-sm-6 col-xs-12'>
                        <div className='form-group'>
                          <label htmlFor="">P.O. Order Quantity. (Mtrs)</label>
                          <h4>: &nbsp;&nbsp; {dprHeader.poOrderQuantity || "-"}</h4>
                        </div>
                      </div>
                      <div className='col-md-5 col-sm-6 col-xs-12'>
                        <div className='form-group'>
                          <label htmlFor="">Order Quantity Pipes Approx.</label>
                          <h4>: &nbsp;&nbsp; {dprHeader.orderQuantityPipes || "-"}		</h4>
                        </div>
                      </div>
                    </form>
                  </div>
                </section>

                <section className='ReporttableSection'>
                  <div className='container-fluid'>
                    <div className='row'>
                      <div className='col-md-12 col-sm-12 col-xs-12'>
                        <div id='custom-scroll'>
                          <table>
                            <thead>
                              <tr>
                                <th>SR.NO</th>
                                <th>WORK STATION</th>
                                <th>PREVIOUS DAY</th>
                                <th>FOR THE DAY</th>
                                <th>CUMMULATIVE</th>
                              </tr>
                              <tr>
                                <th colSpan={5}>3LPE (EXTERNAL) COATING</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>1</td>
                                <td>{dprDetail.dprOption1 || '-'}</td>
                                <td>{dprDetail.bprPreviousDay || '-'}</td>
                                <td>{dprDetail.bprFortheday || '-'}</td>
                                <td>{dprDetail.bprCummulative || '-'}</td>
                              </tr>
                              <tr>
                                <td>17</td>
                                <td>{dprDetail.dprOption17 || '-'}</td>
                                <td colSpan={3}>{dprDetail.pbfdispatchmtr || '-'}</td>
                              </tr>
                              <tr>
                                <th colSpan='2' style={{ textAlign: 'left', paddingLeft: '20px' }}>{dprDetail.dprOption18 || '-'}</th>
                                <th colSpan='3'>0</th>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <form className='row m-0' style={{borderBottom: "2px solid #999999"}}>
                          <div className='col-md-6 col-sm-6 col-xs-12'>
                            <div className='form-group'>
                              <label htmlFor="">Remarks</label>
                              <h4>{dprFooter.remarks || "-"}</h4>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="FooterdataSection">
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-md-12 col-sm-12 col-xs-12">
                        <div className="InspectedAcceptedTableFlex">
                          <div className="InspectedBox">
                            <h2>INSPECTED BY</h2>
                            <div className="INSPECTEDBYTdTable">
                              <div className="INSPECTEDBYBox">
                                <img src={tatastamp} className="TATAStampImg" alt="TATA Stamp" />
                                <img src={qcsignature} className="QCSignatureImg" alt="QC Signature" />
                              </div>
                              <label>Name</label>
                              <label>Designation, Department</label>
                              <label>Date</label>
                            </div>
                          </div>
                          <div className="AcceptedBox">
                            <h2>ACCEPTED BY</h2>
                            <div className="AccceptedBYFlexBox">
                              <div className="NDDBox">
                                <img src={tqasignature} alt="QA Signature" />
                                <label>Name</label>
                                <label>Symbol</label>
                                <label>Company Name</label>
                                <label>Date</label>
                              </div>
                              {[1, 2, 3].map((index) => (
                                <div className="NDDBox" key={index}>
                                  <img src={tpisignature} alt={`TPI-${index} Signature`} />
                                  <label>Name</label>
                                  <label>Symbol</label>
                                  <label>Company Name</label>
                                  <label>Date</label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dailyproductionreport;
