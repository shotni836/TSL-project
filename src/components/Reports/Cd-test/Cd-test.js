import React, { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";
import Environment from "../../../environment";
import '../Allreports.css';
import HeaderDataSection from "../Headerdata";
import Footerdata from '../Footerdata';
import Loading from "../../Loading";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RawMaterialCD from '../Raw-material-cd';
import secureLocalStorage from 'react-secure-storage';
import html2pdf from 'html2pdf.js';

function formatDate(dateString) {
    return dateString ? new Date(dateString).toLocaleDateString('en-GB') : "-";
}

function CdReport() {
    const { tstmaterialid } = useParams();
    const contentRef = useRef();
    const [headerDetails, setHeaderDetails] = useState({});
    const [testDetails, setTestDetails] = useState([]);
    const [instrumentDetails, setInstrumentDetails] = useState([]);
    const [key, setKey] = useState()
    const [value, setKeyValue] = useState()
    const [rawMaterialDetails, setRawMaterialDetails] = useState([]);
    const [totalPlus, setTotalPlus] = useState(0)
    const [totalMinus, setTotalMinus] = useState(0)
    const [reportTestDate, setReportTestDate] = useState()
    const [loading, setLoading] = useState(false);
    const [signatureReport, setSignatureReport] = useState([])
    const [showRemarks, setShowRemarks] = useState([])
    const [witnessValue, setWitnessValue] = useState('');
    const [witnessSelected, setWitnessSelected] = useState(false);
    const [showWitness, setShowWitness] = useState(true)
    const [witnessData, setWitnessData] = useState([])
    const location = useLocation();
    const [isClicked, setIsClicked] = useState(false)
    const navigate = useNavigate();
    const pathSegments = location.pathname.split(/[\/&]/);
    const companyId = secureLocalStorage.getItem("emp_current_comp_id")
    const [regPerc, setRegPerc] = useState();

    let pm_project_id1 = null;
    let pm_processSheet_id1 = null;
    let pm_processtype_id1 = null;
    let pm_approved_by1 = null;
    let pm_Approve_level1 = null;
    let menuId1 = null;
    for (let i = 0; i < pathSegments.length; i++) {
        if (pathSegments[i].startsWith('pm_project_id=')) {
            pm_project_id1 = pathSegments[i].substring('pm_project_id='.length);
        }
        if (pathSegments[i].startsWith('pm_processSheet_id=')) {
            pm_processSheet_id1 = pathSegments[i].substring('pm_processSheet_id='.length);
        }
        if (pathSegments[i].startsWith('pm_processtype_id=')) {
            pm_processtype_id1 = pathSegments[i].substring('pm_processtype_id='.length);
        }
        if (pathSegments[i].startsWith('pm_approved_by=')) {
            pm_approved_by1 = pathSegments[i].substring('pm_approved_by='.length);
        }
        if (pathSegments[i].startsWith('pm_Approve_level=')) {
            pm_Approve_level1 = pathSegments[i].substring('pm_Approve_level='.length);
        }
        if (pathSegments[i].startsWith('menuId=')) {
            menuId1 = pathSegments[i].substring('menuId='.length);
        }
    }

    const [id1, id2, id3, id4] = tstmaterialid.split('&');
    const [formData, setFormData] = useState({
        pm_comp_id: 1,
        pm_location_id: 1,
        pm_project_id: parseInt(pm_project_id1),
        pm_processSheet_id: parseInt(pm_processSheet_id1),
        pm_processtype_id: parseInt(pm_processtype_id1),
        pm_remarks: "",
        pm_approver_status: true,
        pm_approved_by: pm_approved_by1,
        pm_approved_on: new Date().toISOString().split('T')[0],
        pm_Approve_level: pm_Approve_level1 === "first" ? 1 : pm_Approve_level1 === "second" ? 2 : 0,
        pm_approvedRoleId_by: '0',
        p_test_run_id: parseInt(id2),
        pm_isfinalapproval: 0
    });

    const parseKeyValuePair = (str) => {
        const parts = str.split(':-');
        const key = parts[0].trim(); // Key before ':-'
        const value = parts[1]?.trim(); // Value after ':-', using optional chaining
        return { key, value };
    };

    function convertDate(dateString) {
        const date = dateString.split("T")[0]
        const dateParts = date?.split('-');

        return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                if (tstmaterialid) {
                    const [id1, id2, id3, id4] = tstmaterialid.split('&');
                    const response = await axios.post(`${Environment.BaseAPIURL}/api/User/GetCDTestReport?pm_procsheet_id=${id1}&testRunId=${id2}&rtype=${id3}&testid=${id4}`);
                    const data = response.data[0];
                    setHeaderDetails(data._CdTesHeaderDetails[0] || {});
                    setTestDetails(data._CdTestDetails || []);
                    setRawMaterialDetails(data._CdTestRawMaterial || []);
                    const { key, value } = parseKeyValuePair(data._CdTesHeaderDetails[0].poNo);
                    setKey(key);
                    setKeyValue(value)

                    const date = data._CdTesHeaderDetails[0]?.testFinishDate || {}
                    const formattedDate = date?.split('T')[0]
                    const newDateStr = formattedDate.replace(/-/g, '');
                    setReportTestDate(newDateStr);

                    setTotalPlus(parseInt(data._CdTestDetails[0].pm_reqmnt_temperature) + parseInt(data._CdTestDetails[0].pm_reqmnt_temp_plus))
                    setTotalMinus(parseInt(data._CdTestDetails[0].pm_reqmnt_temperature) - parseInt(data._CdTestDetails[0].pm_reqmnt_temp_Minus))

                    const response1 = await axios.get(`${Environment.BaseAPIURL}/api/User/GETInstrumentDetailsByReportId?ReportId=297`); //${id4}`);
                    const data1 = response1.data[0]
                    setInstrumentDetails(data1);
                }
                try {
                    if (tstmaterialid) {
                        const [id1, id2, id3, id4] = tstmaterialid.split('&');
                        const response = await axios.get(`${Environment.BaseAPIURL}/api/User/GetInspectedByAcceptedByDetails?matid=${id3}&testId=${id2}`);
                        const data = response.data
                        setSignatureReport(data)
                        callWitness()
                    }
                    setLoading(false)
                } catch (error) {
                    console.error('Error fetching report data:', error);
                    setLoading(false)
                }
            } catch (error) {
                setLoading(false)
                console.error('Error fetching report data:', error);
            }
        };
        fetchData();
    }, [tstmaterialid]);

    async function callWitness() {
        const [id1, id2] = tstmaterialid.split('&');
        const response1 = await axios.post(`${Environment.BaseAPIURL}/api/User/GetEmployeeTypeWithName?p_procsheet_id=${pm_processSheet_id1}&p_test_run_id=${id2}&p_type_id=${pm_processtype_id1}`);
        setWitnessData(response1?.data)
        const pm_status_app_rej = response1?.data[0]?.pm_status_app_rej
        if (pm_status_app_rej == null || pm_status_app_rej == 0 || pm_status_app_rej == 2 || pm_Approve_level1 == 'second') {
            setShowRemarks(true)
        } else {
            setShowRemarks(false)
        }
        setFormData({ ...formData, pm_approvedRoleId_by: witnessValue != '' ? witnessValue : pm_Approve_level1 == 'first' ? response1?.data[0]?.roleId.toString() : companyId.toString(), pm_isfinalapproval: response1.data.length == 1 ? 1 : 0 })
        setWitnessValue(response1?.data[0]?.roleId)
        setWitnessSelected(true);
        const matchingData = response1?.data.find(item => item.roleId == companyId);
        const regPerc = matchingData ? matchingData.reg_perc : null;
        setRegPerc(regPerc)
    }

    function handleSelect(e) {
        setWitnessValue(e.target.value)
        setFormData({ ...formData, pm_approvedRoleId_by: e.target.value })
        setWitnessSelected(true);
        if (!showRemarks) {
            handleStatusChange("A")
        }
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleStatusChange = (value) => {
        setIsClicked(true)
        if (value === "A") {
            setFormData({ ...formData, pm_approver_status: true, pm_approvedRoleId_by: witnessValue != '' ? witnessValue : pm_Approve_level1 == 'first' ? witnessValue.toString() : companyId.toString() });
            setWitnessSelected(true);
            setShowWitness(true);
        }
        if (value === "R") {
            setFormData({ ...formData, pm_approver_status: false, pm_approvedRoleId_by: "0" });
            setShowWitness(false);
            setWitnessSelected(false)
        }
    };

    const renderApprovalSection = () => {
        return (
            showRemarks ?
                <div className='RemarksFlexBox'>
                    <label htmlFor="">Remarks</label>
                    <input name="pm_remarks" value={formData.pm_remarks} onChange={handleChange} type="text" placeholder="Enter Approval/Rejection Remarks...." autoComplete="off" />
                    <div className='ApproveRejectUIFlex'>
                        <label className="custom-radio">
                            <input type="radio" className="Approveinput" name="pm_approver_status" id="btnaprv" onChange={() => handleStatusChange("A")} />
                            <span className="radio-btn"><i className="fas fa-check"></i>Approve</span>
                        </label>
                        <label className="custom-radio">
                            <input type="radio" className="Rejectinput" name="pm_approver_status" id="btnreject" onChange={() => handleStatusChange("R")} />
                            <span className="radio-btn"><i className="fas fa-times"></i>Reject</span>
                        </label>
                    </div>
                </div> : ''
        );
    };

    const renderFirstApprovalStatus = () => {
        if (pm_Approve_level1 == "first") {
            return (
                <div className="bare-pipe-inspection">
                    {renderApprovalSection()}
                    {showWitness && (<div className="SelectWitnessFlexBox">
                        <label htmlFor="" >Select Witness <b>*</b></label>
                        <select name="" value={witnessValue} onChange={handleSelect}>
                            <option disabled selected>Select Witness</option>
                            {witnessData && witnessData?.map((data) => {
                                return (
                                    <option value={data?.roleId}>{data?.Name}</option>
                                )
                            })}
                        </select>
                    </div>)}
                    <div className='SubmitBtnFlexBox'>
                        {<button type="button" className="SubmitBtn" onClick={handleSubmit}>Submit</button>}
                    </div>
                </div>
            );
        } else {
            return null;
        }
    };

    const renderSecondApprovalStatus = () => {
        if (pm_Approve_level1 == "second") {
            return (
                <div className='BarePipeInspForm row m-0'>
                    <div className="col-md-12 col-sm-12 col-xs-12">
                        <div className='renderApprovalFlexBox'>
                            {renderApprovalSection()}
                            {<button type="button" onClick={handleSubmit}>Submit</button>}
                        </div>
                    </div>
                </div>
            );
        } else {
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (showRemarks) {
            if (formData?.pm_remarks == '' || isClicked == false) {
                toast.error("Please enter remarks and status")
                return
            }
        }

        if (showWitness && !witnessSelected && pm_Approve_level1 != "second") {
            toast.error('Please select a witness before submitting the form.');
            return;
        }
        try {
            const response = await fetch(Environment.BaseAPIURL + "/api/User/InspectionSheetApproval", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ formData, 'checkedPipes': [''] }),
            });

            const responseBody = await response.text();

            if (responseBody === '100' || responseBody === '200') {
                toast.success('Status Updated Successfully!');
                navigate(`/rawmateriallist?menuId=${menuId1}&testingtype=${pm_processtype_id1}`)
                console.log("Form data sent successfully!");
            } else {
                console.error(
                    "Failed to send form data to the server. Status code:",
                    response.status
                );
                console.error("Server response:", responseBody);
            }
        } catch (error) {
            console.error("An error occurred while sending form data:", error);
        }
    };

    const handleDownloadPDF = () => {
        const element = contentRef.current;
        const opt = {
            margin: [10, 10, 10, 10],
            filename: `${headerDetails?.reportAlias}/${reportTestDate}.replace(/\//g, "-")}.pdf`,
            image: { type: 'jpeg', quality: 1.0 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'pt', format: 'a4', orientation: 'landscape' }
        };
        html2pdf().set(opt).from(element).save();
    };

    const handlePrint = () => {
        window.print();
    };

    const mergeRow = (testDetails) => {
        const rowSpans = [];
        let currentPipeNo = null;
        let currentSpan = 0;

        testDetails.forEach((item, index) => {
            const isSamePipeNo = item.pipeNo === currentPipeNo;

            if (isSamePipeNo) {
                currentSpan++;
                rowSpans.push(0);
            } else {
                if (currentSpan > 0) {
                    rowSpans[rowSpans.length - currentSpan] = currentSpan;
                }
                currentPipeNo = item.pipeNo;
                currentSpan = 1;
                rowSpans.push(currentSpan);
            }
        });

        if (currentSpan > 0) {
            rowSpans[rowSpans.length - currentSpan] = currentSpan;
        }

        return rowSpans;
    }

    const rowSpans = mergeRow(testDetails);

    const chunkAndPadArray = (array, chunkSize) => {
        const chunks = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            chunks.push(array.slice(i, i + chunkSize));
        }
        return chunks;
    };

    const chunkedData = id4 === '297' || id4 === '300' ? chunkAndPadArray(testDetails, 1) : chunkAndPadArray(testDetails, 2);
    // 297,300::301,302,298,299

    return (
        <>
            {
                loading ? <Loading /> :
                    <div>
                        <div style={{ textAlign: 'right', paddingRight: '14px', paddingTop: '10px' }}>
                            <div className="DownloadPrintFlexSection">
                                <h4 className='DownloadPDFBtn' onClick={handleDownloadPDF}>
                                    <i className="fas fa-download"> </i> Download PDF
                                </h4>
                                <h4 className='PrintBtn' onClick={handlePrint}>
                                    <i className="fas fa-print"></i> Print
                                </h4>
                            </div>
                        </div>
                        <div ref={contentRef}>
                            {chunkedData.map((chunk, chunkIndex) => (
                                <div key={chunkIndex} className='InspReportSection' ref={contentRef}>
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
                                                                        <span>: &nbsp;</span>
                                                                        <h4 style={{ textTransform: 'uppercase' }}> {headerDetails.clientName || "-"}</h4>
                                                                    </div>
                                                                </div>
                                                                <div className='col-md-5 col-sm-6 col-xs-12'>
                                                                    <div className='form-group'>
                                                                        <label htmlFor="">Report No.</label>
                                                                        <span>: &nbsp;</span>
                                                                        <h4>
                                                                            {headerDetails?.reportAlias}/{reportTestDate} - {String(chunkIndex + 1).padStart(2, '0')}
                                                                            {/* {headerDetails?.reportPqt == '' ? '' : (
                                                                        <> ({headerDetails.reportPqt})</>
                                                                    )} */}
                                                                        </h4>
                                                                    </div>
                                                                </div>
                                                                <div className='col-md-7 col-sm-6 col-xs-12'>
                                                                    <div className='form-group'>
                                                                        <label htmlFor="">{key ? key : ''}.</label>
                                                                        <span>: &nbsp;</span>
                                                                        <h4>{value ? value : ''}</h4>
                                                                    </div>
                                                                </div>
                                                                <div className='col-md-5 col-sm-6 col-xs-12'>
                                                                    <div className='form-group'>
                                                                        <label htmlFor="">Date & Shift</label>
                                                                        <span>: &nbsp;</span>
                                                                        <h4 style={{ textTransform: 'uppercase' }}>{headerDetails.dateShift || "-"}</h4>
                                                                    </div>
                                                                </div>
                                                                <div className='col-md-7 col-sm-6 col-xs-12'>
                                                                    <div className='form-group'>
                                                                        <label htmlFor="">Pipe Size</label>
                                                                        <span>: &nbsp;</span>
                                                                        <h4>{headerDetails.pipeSize || "-"}</h4>
                                                                    </div>
                                                                </div>
                                                                <div className='col-md-5 col-sm-6 col-xs-12'>
                                                                    <div className='form-group'>
                                                                        <label htmlFor="">Process Sheet No.</label>
                                                                        <span>: &nbsp;</span>
                                                                        <h4>{headerDetails?.procSheetNo} REV.  {headerDetails?.procesheet_revisionno
                                                                            ? String(headerDetails?.procesheet_revisionno).padStart(2, '0')
                                                                            : '00'}  {headerDetails?.procesheet_revisionno ? "DATE : " + convertDate(headerDetails?.procesheet_revisiondate.split("T")[0]) : ''}</h4>
                                                                    </div>
                                                                </div>
                                                                <div className='col-md-7 col-sm-6 col-xs-12'>
                                                                    <div className='form-group'>
                                                                        <label htmlFor="">Type Of Coating</label>
                                                                        <span>: &nbsp;</span>
                                                                        <h4>{headerDetails.typeofCoating || "-"}</h4>
                                                                    </div>
                                                                </div>
                                                                <div className='col-md-5 col-sm-6 col-xs-12'>
                                                                    <div className='form-group'>
                                                                        <label htmlFor="">Procedure / WI No.</label>
                                                                        <span>: &nbsp;</span>
                                                                        <h4>{headerDetails.wino || "-"}</h4>
                                                                    </div>
                                                                </div>
                                                                <div className='col-md-7 col-sm-6 col-xs-12'>
                                                                    <div className='form-group'>
                                                                        <label htmlFor="">Test Start Date</label>
                                                                        <span>: &nbsp;</span>
                                                                        <h4>{formatDate(headerDetails.testStartDate).replace(/\//g, '/') || "-"}</h4>
                                                                    </div>
                                                                </div>
                                                                <div className='col-md-5 col-sm-6 col-xs-12'>
                                                                    <div className='form-group'>
                                                                        <label htmlFor="">Test Start Time</label>
                                                                        <span>: &nbsp;</span>
                                                                        <h4>{headerDetails.testStartTimeNew || "-"}</h4>
                                                                    </div>
                                                                </div>
                                                                <div className='col-md-7 col-sm-6 col-xs-12'>
                                                                    <div className='form-group'>
                                                                        <label htmlFor="">Test Finish Date</label>
                                                                        <span>: &nbsp;</span>
                                                                        <h4>{formatDate(headerDetails.testFinishDate).replace(/\//g, '/') || "-"}</h4>
                                                                    </div>
                                                                </div>
                                                                <div className='col-md-5 col-sm-6 col-xs-12'>
                                                                    <div className='form-group'>
                                                                        <label htmlFor="">Test Finish Time</label>
                                                                        <span>: &nbsp;</span>
                                                                        <h4>{headerDetails.testFinishTimeNew || "-"}</h4>
                                                                    </div>
                                                                </div>
                                                            </form>
                                                        </div>
                                                    </section>

                                                    {Array.isArray(testDetails) && testDetails.length > 0 && (
                                                        <section className='ReporttableSection'>
                                                            <div className='container-fluid'>
                                                                <div className='row'>
                                                                    <div className='col-md-12 col-sm-12 col-xs-12'>
                                                                        <div id='custom-scroll'>
                                                                            <table>
                                                                                <thead>
                                                                                    <tr>
                                                                                        <th style={{ width: '60px' }}>Sr. No.</th>
                                                                                        <th>Pipe No.</th>
                                                                                        <th>Coating Date</th>
                                                                                        <th>Reference Standard</th>
                                                                                        <th>Operating Temp. (°C)</th>
                                                                                        <th>Test Duration</th>
                                                                                        <th>Acceptance Criteria</th>
                                                                                        <th>Result</th>
                                                                                        <th>Remarks</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                    {chunk?.map((item, index) => {
                                                                                        return (
                                                                                            <tr key={index + 1}>
                                                                                                <td>{index + 1}</td>
                                                                                                {rowSpans[index] > 0 && (
                                                                                                    <td rowSpan={rowSpans[index]}>
                                                                                                        {item.pipeNo || "-"}
                                                                                                    </td>
                                                                                                )}
                                                                                                {rowSpans[index] > 0 && (
                                                                                                    <td rowSpan={rowSpans[index]}>
                                                                                                        {formatDate(item.coatingDate).replace(/\//g, '/') || "-"}{headerDetails?.reportPqt == '' ? '' : (<> ({headerDetails.reportPqt})</>)}
                                                                                                    </td>
                                                                                                )}
                                                                                                {rowSpans[index] > 0 && (
                                                                                                    <td rowSpan={rowSpans[index]}>
                                                                                                        {item.referenceStandard || "-"}
                                                                                                    </td>
                                                                                                )}
                                                                                                <td>{item.pm_reqmnt_temperature != "" ? item.pm_reqmnt_temp_plus != '' && item.pm_reqmnt_temp_Minus != '' ? item.pm_reqmnt_temp_plus == item.pm_reqmnt_temp_Minus ? item.pm_reqmnt_temperature + "± " + item.pm_reqmnt_temp_Minus : totalMinus + "-" + totalPlus : item.pm_reqmnt_temperature : "-"}</td>
                                                                                                {rowSpans[index] > 0 && (
                                                                                                    <td rowSpan={rowSpans[index]}>
                                                                                                        {item.testDuration || "-"}
                                                                                                    </td>
                                                                                                )}
                                                                                                <td>{item.acceptanceCriteria || ''}</td>
                                                                                                <td>{item.pm_test_result_remarks ? parseFloat(item.pm_test_result_remarks).toFixed(2) + (item.unit ? " " + item.unit : '') : "-"}</td>
                                                                                                {rowSpans[index] > 0 && (
                                                                                                    <td rowSpan={rowSpans[index]}>
                                                                                                        {item.pm_test_result_suffix || ""}
                                                                                                    </td>
                                                                                                )}
                                                                                            </tr>
                                                                                        )
                                                                                    })}
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </section>
                                                    )}

                                                    <section className='ResultPageSection'>
                                                        <div className='container-fluid'>
                                                            <div className='row'>
                                                                <div className='col-md-12 col-sm-12 col-xs-12 p-0'>
                                                                    <table>
                                                                        <tbody>
                                                                            <tr>
                                                                                <td style={{ borderBottom: "none", padding: '2px 12px' }}>ABOVE RESULTS ARE CONFORMING TO SPECIFICAION - <span style={{ fontFamily: 'Myriad Pro Light' }}>{headerDetails.specification} & QAP NO.- {headerDetails.acceptanceCriteria || "-"}</span></td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </section>

                                                    <section className="InstrumentusedSection">
                                                        <section className="container-fluid">
                                                            <div className="row">
                                                                <div className="col-md-12 col-sm-12 col-xs-12">
                                                                    <table id="instrument-table">
                                                                        <thead>
                                                                            <tr>
                                                                                <th colSpan={3} style={{ textAlign: 'center' }}> INSTRUMENT USED</th>
                                                                            </tr>
                                                                            <tr>
                                                                                <th>SR. NO.</th>
                                                                                <th>INSTRUMENT NAME</th>
                                                                                <th>INSTRUMENT ID / SERIAL NO.</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {instrumentDetails.map((item, index) => (
                                                                                (item.SrNo || item.equip_name || item.equip_code) && (
                                                                                    <tr key={index}>
                                                                                        <td>{index + 1}</td>
                                                                                        <td>{item.equip_name || "-"}</td>
                                                                                        <td>{item.equip_code || "-"}</td>
                                                                                    </tr>
                                                                                )))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </section>
                                                    </section>

                                                    <RawMaterialCD rawMaterialDetails={rawMaterialDetails} />

                                                    {signatureReport && signatureReport.length > 0 ? <Footerdata data={signatureReport} /> : ''}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row text-center">
                                        <div className='col-md-12 col-sm-12 col-xs-12'>
                                            {renderFirstApprovalStatus()}
                                        </div>
                                        <div className='col-md-12 col-sm-12 col-xs-12'>
                                            {renderSecondApprovalStatus()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
            }
        </>
    );
}

export default CdReport;