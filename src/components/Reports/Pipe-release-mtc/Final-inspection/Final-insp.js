import React, { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";
import Environment from "../../../../environment";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import '../../Allreports.css';
import HeaderDataSection from "../../Headerdata";
import ReportRemarks from '../../Report-remarks';
import InstrumentusedSection from '../../Instrument-used';
import Footerdata from '../../Footerdata';

function FinalInsp() {

  const { tstmaterialid } = useParams();
  const contentRef = useRef();
  const [headerDetails, setHeaderDetails] = useState({});
  const [testDetails, setTestDetails] = useState([]);
  const [instrumentDetails, setInstrumentDetails] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (tstmaterialid) {
          const [id1, id2] = tstmaterialid.split('&');
          const response = await axios.post(`${Environment.BaseAPIURL}/api/User/GetBarePipeInspectionReport?matid=${id1}&testId=${id2}`);
          const data = response.data[0];
          setHeaderDetails(data._CdTesHeaderDetails[0] || {});
          setTestDetails(data._BarePipeInspectionReportDetails || []);
          setInstrumentDetails(data._CdTestInstrument || []);
        }
      } catch (error) {
        console.error('Error fetching report data:', error);
      }
    };
    fetchData();
  }, [tstmaterialid]);

  const handleDownload = () => {
    const content = contentRef.current;
    const options = {
      scale: 2,
      useCORS: true,
      scrollX: 0,
      scrollY: 0,
      windowWidth: document.documentElement.scrollWidth,
      windowHeight: document.documentElement.scrollHeight,
    };

    // table borders for PDF generation
    const tableElements = content.querySelectorAll('table');
    tableElements.forEach(table => {
      table.style.border = '1px solid #999999';

      // borders from table cells
      const cells = table.querySelectorAll('td, th');
      cells.forEach(cell => {
        cell.style.border = '1px solid #999999';
      });
    });

    html2canvas(content, options)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const pdf = new jsPDF('landscape', 'mm', 'a4');
        pdf.addImage(imgData, 'JPEG', 0, 0, pdf.internal.pageSize.width, pdf.internal.pageSize.height);
        pdf.save('Final-insp_report.pdf');
      })
      .catch((error) => {
        console.error('Error generating PDF:', error);
        alert('An error occurred while generating the PDF. Please try again later.');
      });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div style={{ textAlign: 'right', paddingRight: '14px', paddingTop: '10px' }}>
        <h4 className='DownloadPDFBtn' onClick={handleDownload}>
          <i className="fas fa-download"> </i> Download PDF
        </h4>
        <h4 className='PrintBtn' onClick={handlePrint}>
          <i className="fas fa-print"></i> Print
        </h4>
      </div>
      <div className='InspReportSection' ref={contentRef}>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-md-12 col-sm-12 col-xs-12'>
              <div className='InspReportBox'>

                <HeaderDataSection reportData={headerDetails} />

                <section className='Reportmasterdatasection'>
                  <div className='container-fluid'>
                    <form className='row'>
                      <div className='col-md-7 col-sm-6 col-xs-12'>
                        <div className='form-group'>
                          <label htmlFor="">Client</label>
                          <h4>: &nbsp;&nbsp; {headerDetails.clientName || "-"}</h4>
                        </div>
                      </div>
                      <div className='col-md-5 col-sm-6 col-xs-12'>
                        <div className='form-group'>
                          <label htmlFor="">Report No.</label>
                          <h4>: &nbsp;&nbsp;{headerDetails.reportNo || "-"}</h4>
                        </div>
                      </div>
                      <div className='col-md-7 col-sm-6 col-xs-12'>
                        <div className='form-group'>
                          <label htmlFor="">P.O No.</label>
                          <h4>: &nbsp;&nbsp;{headerDetails.poNo || "-"}</h4>
                        </div>
                      </div>
                      <div className='col-md-5 col-sm-6 col-xs-12'>
                        <div className='form-group'>
                          <label htmlFor="">Date & Shift</label>
                          <h4>: &nbsp;&nbsp;{headerDetails.dateShift || "-"}</h4>
                        </div>
                      </div>
                      <div className='col-md-7 col-sm-6 col-xs-12'>
                        <div className='form-group'>
                          <label htmlFor="">Pipe Size</label>
                          <h4>: &nbsp;&nbsp;{headerDetails.pipeSize || "-"}</h4>
                        </div>
                      </div>
                      <div className='col-md-5 col-sm-6 col-xs-12'>
                        <div className='form-group'>
                          <label htmlFor="">Acceptance Criteria</label>
                          <h4>: &nbsp;&nbsp;{headerDetails.acceptanceCriteria || "-"}</h4>
                        </div>
                      </div>
                      <div className='col-md-7 col-sm-6 col-xs-12'>
                        <div className='form-group'>
                          <label htmlFor="">Specification</label>
                          <h4>: &nbsp;&nbsp;{headerDetails.specification || "-"}</h4>
                        </div>
                      </div>
                      <div className='col-md-5 col-sm-6 col-xs-12'>
                        <div className='form-group'>
                          <label htmlFor="">Process Sheet No.</label>
                          <h4>: &nbsp;&nbsp;{headerDetails.procSheetNo || "-"}</h4>
                        </div>
                      </div>
                      <div className='col-md-7 col-sm-6 col-xs-12'>
                        <div className='form-group'>
                          <label htmlFor="">Type Of Coating</label>
                          <h4>: &nbsp;&nbsp;{headerDetails.typeofCoating || "-"}</h4>
                        </div>
                      </div>
                      <div className='col-md-5 col-sm-6 col-xs-12'>
                        <div className='form-group'>
                          <label htmlFor="">Procedure / WI No.</label>
                          <h4>: &nbsp;&nbsp;{headerDetails.procedureWINo || "-"}</h4>
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
                                <th rowSpan={2}>Sr. No.</th>
                                <th rowSpan={2}>Coating No. / Field No.</th>
                                <th rowSpan={2}>Pipe No.</th>
                                <th rowSpan={2}>Heat No.</th>
                                <th rowSpan={2}>Length (mtr)</th>
                                <th rowSpan={2}>ASL No.</th>
                                <th colSpan={2}>Cut Back</th>
                                <th colSpan={2}>Epoxy Band</th>
                                <th colSpan={2}>Cut Back Angle</th>
                                <th rowSpan={2}>Holiday (kV)</th>
                                <th rowSpan={2}>Residual Magnetism</th>
                                <th rowSpan={2}>Visual</th>
                                <th rowSpan={2}>Date of Coating</th>
                                <th rowSpan={2}>Remarks</th>
                              </tr>
                              <tr>
                                <th>F End</th>
                                <th>T End</th>
                                <th>F End</th>
                                <th>T End</th>
                                <th>F End</th>
                                <th>T End</th>
                              </tr>
                              <tr>
                                <th colSpan={5} rowSpan={2}>Specified Requirement</th>
                                <th>Min.</th>
                                <th colSpan={2}>150 MM</th>
                                <th colSpan={2}>15 MM</th>
                                <th colSpan={2}>30</th>
                                <th rowSpan={2}>25</th>
                                <th rowSpan={2}>Max. 30 Gauss</th>
                                <th rowSpan={2}>-</th>
                                <th rowSpan={2}>-</th>
                                <th rowSpan={2}>-</th>
                              </tr>
                              <tr>
                                <th>Max.</th>
                                <th colSpan={2}>175 MM</th>
                                <th colSpan={2}>25 MM</th>
                                <th colSpan={2}>-</th>
                              </tr>
                            </thead>
                            <tbody>
                              {testDetails?.reportTableList?.map((item, index) => (
                                <tr key={index + 1}>
                                  <td>{item.srNo}</td>
                                  <td>{item.coatFieldNo || "-"}</td>
                                  <td>{item.pipeNo || "-"}</td>
                                  <td>{item.heatNo || "-"}</td>
                                  <td>{item.length || "-"}</td>
                                  <td>{item.aslNo || "-"}</td>
                                  <td>{item.cbf || "-"}</td>
                                  <td>{item.cbt || "-"}</td>
                                  <td>{item.ebf || "-"}</td>
                                  <td>{item.ebt || "-"}</td>
                                  <td>{item.cbaf || "-"}</td>
                                  <td>{item.cbat || "-"}</td>
                                  <td>{item.holiday || "-"}</td>
                                  <td>{item.resMagn || "-"}</td>
                                  <td>{item.visual || "-"}</td>
                                  <td>{item.coatDate || "-"}</td>
                                  <td>{item.remarks || "-"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* <ReportRemarks reportData={headerDetails} /> */}

                <InstrumentusedSection reportData={instrumentDetails} />

                {/* <Footerdata reportData={headerDetails} /> */}

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FinalInsp;