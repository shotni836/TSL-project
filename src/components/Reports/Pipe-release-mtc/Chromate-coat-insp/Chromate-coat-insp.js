import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import Environment from "../../../../environment";
import '../../Allreports.css';
import Loading from '../../../Loading';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import '../../Allreports.css';
import HeaderDataSection from "../../Headerdata";
import ReportRemarks from '../../Report-remarks';
import InstrumentusedSection from '../../Instrument-used';
import Footerdata from '../../Footerdata';
import "../Bare-pipe-insp/BarePipe.css"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import html2pdf from 'html2pdf.js';
import secureLocalStorage from 'react-secure-storage';

const getInitials = (name) => {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase();
};

const combineDataWithWitnesses = (data, witnessesByPipeCode) => {
    return data.map(pipe => {
        const pipeCode = pipe["Pipe No."].value;
        return {
            ...pipe,
            witnesses: witnessesByPipeCode[pipeCode] || []
        };
    });
};

function ChromateCoatInsp() {
    const { tstmaterialid } = useParams();
    const contentRef = useRef();
    const headerDetails = useRef([]);
    const [testDetails, setTestDetails] = useState([]);
    const [instrumentDetails, setInstrumentDetails] = useState([]);
    const [showWitness, setShowWitness] = useState(true)
    const [witnessData, setWitnessData] = useState([])
    const [headers, setHeaders] = useState([])
    const [signatureReport, setSignatureReport] = useState([])
    const [showRemarks, setShowRemarks] = useState([])
    const [witnessesByPipeCode, setWitnessesByPipeCode] = useState([]);
    const [reportTestDate, setReportTestDate] = useState()
    const [randomWitnesses, setRandomWitnesses] = useState([])
    const [key, setKey] = useState()
    const [value, setKeyValue] = useState()
    const [rawMaterial, setRawMaterial] = useState([]);
    const [cdLineDetail, setCdLineDetail] = useState([]);
    const [epoxyGuns, setEpoxyGuns] = useState([]);
    const location = useLocation();
    const pathSegments = location.pathname.split(/[\/&]/);
    const queryParams = new URLSearchParams(location.search);
    const navigate = useNavigate()
    const [witnessSelected, setWitnessSelected] = useState(false);
    const [loading, setLoading] = useState(false);
    const [witnessValue, setWitnessValue] = useState('');
    const [isClicked, setIsClicked] = useState(false)
    const [regPerc, setRegPerc] = useState();
    const [airPressureLength, setAirPressureLength] = useState();
    const [randomWitnessList, setRandomWitnessList] = useState([]);
    const [epoxyGunsList, setEpoxyGunsList] = useState({});
    // const companyId = 631
    const companyId = secureLocalStorage.getItem("emp_current_comp_id")
    const [checkedItems, setCheckedItems] = useState(
        testDetails.map(() => false) // Initialize all checkboxes as unchecked
    );

    const [minRow, setMinRow] = useState();
    const [maxRow, setMaxRow] = useState();

    let pm_project_id1 = null;
    let pm_processSheet_id1 = null;
    let pm_processtype_id1 = null;
    let pm_approved_by1 = null;
    let test_date1 = null;
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
        if (pathSegments[i].startsWith('test_date=')) {
            test_date1 = pathSegments[i].substring('test_date='.length);
        }
        if (pathSegments[i].startsWith('pm_Approve_level=')) {
            pm_Approve_level1 = pathSegments[i].substring('pm_Approve_level='.length);
        }
        if (pathSegments[i].startsWith('menuId=')) {
            menuId1 = pathSegments[i].substring('menuId='.length);
        }
    }

    // DYNAMIC HEIGHT OF CONTENT DATA
    const [witnessHeight, setWitnessHeight] = useState(0);
    const refDivA = useRef(null); // Reference for the div whose height you want to track
    const refDivB = useRef(null); // Reference for the div whose height you want to set
    const adjustHeight = useCallback(() => {
        if (refDivA.current) {
            const heightA = refDivA.current.offsetHeight; // Get Div A's height
            console.log(heightA);

            setWitnessHeight(heightA); // Set Div B's height
        }
    }, []);

    useEffect(() => {
        // Delay execution to ensure elements are fully rendered
        const handleInitialAdjustment = () => {
            setTimeout(() => adjustHeight(), 100); // Timeout to ensure DOM is fully rendered
        };

        // Observer to track size changes of Div A
        const resizeObserver = new ResizeObserver(() => adjustHeight());

        // Observer to track DOM changes and ensure refs are set
        const mutationObserver = new MutationObserver(() => {
            if (refDivA.current) {
                adjustHeight(); // Adjust height when changes are detected
                resizeObserver.observe(refDivA.current); // Start observing Div A
            }
        });

        // Start observing changes in the DOM (i.e., body or a parent node)
        mutationObserver.observe(document.body, { childList: true, subtree: true });

        // Perform the initial adjustment when the component mounts
        handleInitialAdjustment();

        // Cleanup observers on component unmount
        return () => {
            resizeObserver.disconnect();
            mutationObserver.disconnect();
        };
    }, [adjustHeight]);

    console.log(typeof pm_project_id1, typeof (parseInt(pm_project_id1)))
    const [id1, id2] = tstmaterialid.split('&');
    const [formData, setFormData] = useState({
        pm_comp_id: 1,
        pm_location_id: 1,
        pm_project_id: parseInt(pm_project_id1),
        pm_processSheet_id: parseInt(pm_processSheet_id1),
        pm_processtype_id: parseInt(pm_processtype_id1),
        pm_remarks: "",
        pm_approver_status: true,
        pm_approved_by: pm_approved_by1,
        pm_approved_on: test_date1,
        pm_Approve_level: pm_Approve_level1 == "first" ? 1 : pm_Approve_level1 == "second" ? 2 : 0,
        pm_approvedRoleId_by: '0',
        p_test_run_id: parseInt(id2)
    });


    async function callWitness() {
        const [id1, id2] = tstmaterialid.split('&');
        const response1 = await axios.post(`${Environment.BaseAPIURL}/api/User/GetEmployeeTypeWithName?p_procsheet_id=${pm_processSheet_id1}&p_test_run_id=${id2}&p_type_id=${pm_processtype_id1}`);
        setWitnessData(response1?.data)
        const hasRejectCountGreaterThanZero = response1?.data.some(item => item.RejectCount > 0);
        const allHaveZeroCounts = response1?.data.every(item => item.ApproveCount === 0 && item.RejectCount === 0);
        const pm_status_app_rej = response1?.data[0]?.pm_status_app_rej
        if (pm_status_app_rej == null || pm_status_app_rej == 0 || pm_status_app_rej == 2 || pm_Approve_level1 == 'second') {
            setShowRemarks(true)
        } else {
            setShowRemarks(false)
        }
        // if (response1?.data.length == 1) {
        setWitnessValue(response1?.data[0]?.roleId)
        setFormData({ ...formData, pm_approvedRoleId_by: witnessValue != '' ? witnessValue : pm_Approve_level1 == 'first' ? response1?.data[0]?.roleId.toString() : companyId.toString() })
        setWitnessSelected(true);
        // }
        const matchingData = response1?.data.find(item => item.roleId == companyId);
        const regPerc = matchingData ? matchingData.reg_perc : null;
        setRegPerc(regPerc)
    }

    const parseKeyValuePair = (str) => {
        // Split the string by ':-'
        const parts = str.split(':-');

        // Trim whitespace from both parts
        const key = parts[0].trim(); // Key before ':-'
        const value = parts[1]?.trim(); // Value after ':-', using optional chaining

        return { key, value };
    };
    const handleCheckboxChange = (index) => {
        setCheckedItems((prev) => {
            const newCheckedItems = [...prev];
            newCheckedItems[index] = !newCheckedItems[index];
            return newCheckedItems;
        });
    };
    const checkedCount = checkedItems.filter(Boolean).length;

    function extractMaxEntries(data) {
        console.log(data);

        const keysToKeep = [
            "Airpressure_A1", "Airpressure_A2", "Airpressure_A3", "Airpressure_A4", "Airpressure_A5", "Airpressure_A6", "Airpressure_A7", "Airpressure_A8", "Airpressure_A9", "Airpressure_A10", "Airpressure_A11", "Airpressure_A12",
            "Airpressure_B1", "Airpressure_B2", "Airpressure_B3", "Airpressure_B4", "Airpressure_B5", "Airpressure_B6", "Airpressure_B7", "Airpressure_B8", "Airpressure_B9", "Airpressure_B10", "Airpressure_B11", "Airpressure_B12",
            "Flowrate_A1", "Flowrate_A2", "Flowrate_A3", "Flowrate_A4", "Flowrate_A5", "Flowrate_A6", "Flowrate_A7", "Flowrate_A8", "Flowrate_A9", "Flowrate_A10", "Flowrate_A11", "Flowrate_A12",
            "Flowrate_B1", "Flowrate_B2", "Flowrate_B3", "Flowrate_B4", "Flowrate_B5", "Flowrate_B6", "Flowrate_B7", "Flowrate_B8", "Flowrate_B9", "Flowrate_B10", "Flowrate_B11", "Flowrate_B12",
        ];

        // Create a new object with only the required keys
        const valueCounts = {};

        // Iterate over each entry
        data.forEach(entry => {
            keysToKeep.forEach(key => {
                const value = entry[key];
                if (!valueCounts[key]) {
                    valueCounts[key] = {};
                }
                if (!valueCounts[key][value]) {
                    valueCounts[key][value] = 0;
                }
                valueCounts[key][value]++;
            });
        });

        // Now find the most frequent value for each key
        const mostFrequentValues = {};

        for (const key of keysToKeep) {
            let maxCount = 0;
            let mostFrequentValue = null;

            for (const value in valueCounts[key]) {
                if (valueCounts[key][value] > maxCount) {
                    maxCount = valueCounts[key][value];
                    mostFrequentValue = value;
                }
            }

            mostFrequentValues[key] = mostFrequentValue;
        }

        // Output the most frequent values

        const structuredData = Object.keys(mostFrequentValues)
            .filter(key => key.startsWith('Airpressure_') || key.startsWith('Flowrate_'))
            .reduce((acc, key) => {
                const [type, id] = key.split('_');
                const value = mostFrequentValues[key];
                const existing = acc.find(item => item.id === id) || { id };
                existing[type] = value;
                if (!acc.includes(existing)) {
                    acc.push(existing);
                }
                return acc;
            }, []);
        setEpoxyGunsList(structuredData);

        let filledEntriesCount = 0;

        structuredData.forEach(entry => {
            if (entry.Airpressure && entry.Flowrate) {
                filledEntriesCount++;
                // setAirPressureLength(filledEntriesCount++)
            }
        });

        // structuredData.forEach(entry => {
        //     const airpressureLength = entry.Airpressure.length || 0;
        //     const flowrateLength = entry.Flowrate.length || 0;

        //     console.log(`ID: ${entry.id} - Airpressure Length: ${airpressureLength}, Flowrate Length: ${flowrateLength}`);
        // });

        // setEpoxyGunsList(mostFrequentValues)
        console.log(structuredData);
    }

    useEffect(() => {
        console.log(tstmaterialid)
        const fetchData = async () => {
            try {
                const [id1, id2] = tstmaterialid.split('&');
                const response = await axios.post(`${Environment.BaseAPIURL}/api/User/Get_ChromateCoatingReport?typeId=${pm_processtype_id1}&testId=${id2}`);
                const data = response.data[0];
                headerDetails.current = data._CdTesHeaderDetails[0]
                const date = data._CdTesHeaderDetails[0].reportTestDate || {}
                const parts = date?.split('/');
                const formattedDate = `${parts[2]}${parts[0].padStart(2, '0')}${parts[1].padStart(2, '0')}`;
                setReportTestDate(formattedDate);
                setRawMaterial(data._CdTestMat || []);
                setCdLineDetail(data._CdLineDetails[0] || []);
                // setAirPressureLength(data._CdLineDetails[0].epoxyGun)
                setAirPressureLength(4)
                const maxEntries = extractMaxEntries(data._CdTesMiddleDetails);
                console.log(maxEntries);

                console.log(data._CdLineDetails[0])
                setTestDetails(data._CdTesMiddleDetails || []);
                // setEpoxyGuns(data._epoxygun || []);
                setEpoxyGuns(['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10', 'A11', 'A12', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10', 'B11', 'B12']);
                setHeaders(Object.keys(data._CdTesMiddleDetails[0]))
                const { key, value } = parseKeyValuePair(data._CdTesHeaderDetails[0].poNo);
                setKey(key);
                setKeyValue(value)

                const mergedData = data._CdTesMiddleDetails.map(item => {
                    const result = {};
                    Object.keys(item).forEach(key => {
                        const match = data._CdTestMaxMin.find(d => d.co_param_val_alias === key);
                        if (match) {
                            result[key] = {
                                value: item[key],
                                PM_Reqmnt_test_Max: match.PM_Reqmnt_test_Max,
                                PM_Reqmnt_test_min: match.PM_Reqmnt_test_min,
                                PM_Reqmnt_test_plus: match.pm_reqmnt_temp_plus,
                                PM_Reqmnt_test_minus: match.pm_reqmnt_temp_Minus,
                                pm_value_type: match.pm_value_type,
                                pm_test_value: match.pm_test_value
                            };
                        } else {
                            result[key] = { value: item[key] };
                        }
                    });
                    return result;
                });
                console.log(mergedData);
                setWitnessesByPipeCode(groupWitnessesByPipeCode(data._RandomWitness))
                setRandomWitnesses(data._RandomWitness)
                console.log(mergedData[0])

                const dataWithWitnesses = combineDataWithWitnesses(mergedData, witnessesByPipeCode);
                console.log(dataWithWitnesses)
                setRandomWitnessList(witnessesByPipeCode)
                const headerss = Object.keys(dataWithWitnesses[0]).filter(key => key !== 'witnesses' && key !== 'Airpressure_A1' && key !== 'Airpressure_A2' && key !== 'Airpressure_A3' && key !== 'Airpressure_A4' && key !== 'Airpressure_A5' && key !== 'Airpressure_A6' && key !== 'Airpressure_A7' && key !== 'Airpressure_A8' && key !== 'Airpressure_A9' && key !== 'Airpressure_A10' && key !== 'Airpressure_A11' && key !== 'Airpressure_A12' && key !== 'Airpressure_B1' && key !== 'Airpressure_B2' && key !== 'Airpressure_B3' && key !== 'Airpressure_B4' && key !== 'Airpressure_B5' && key !== 'Airpressure_B6' && key !== 'Airpressure_B7' && key !== 'Airpressure_B8' && key !== 'Airpressure_B9' && key !== 'Airpressure_B10' && key !== 'Airpressure_B11' && key !== 'Airpressure_B12' && key !== 'Flowrate_A1' && key !== 'Flowrate_A2' && key !== 'Flowrate_A3' && key !== 'Flowrate_A4' && key !== 'Flowrate_A5' && key !== 'Flowrate_A6' && key !== 'Flowrate_A7' && key !== 'Flowrate_A8' && key !== 'Flowrate_A9' && key !== 'Flowrate_A10' && key !== 'Flowrate_A11' && key !== 'Flowrate_A12' && key !== 'Flowrate_B1' && key !== 'Flowrate_B2' && key !== 'Flowrate_B3' && key !== 'Flowrate_B4' && key !== 'Flowrate_B5' && key !== 'Flowrate_B6' && key !== 'Flowrate_B7' && key !== 'Flowrate_B8' && key !== 'Flowrate_B9' && key !== 'Flowrate_B10' && key !== 'Flowrate_B11' && key !== 'Flowrate_B12' && key !== 'LineSpeed' && key !== 'DewPointforCoating' && key !== 'HdpeScrewRpm1' && key !== 'AdhesiveScrewRpm' && key !== 'HdpeScrewRpm2');
                // const headerss = Object.keys(mergedData[0]);

                // Extract rows
                const minValues = headerss.map(header => mergedData[0][header].pm_value_type == 'A' ? mergedData[0][header].pm_test_value : mergedData[0][header].PM_Reqmnt_test_min || "-");
                const maxValues = headerss.map(header => mergedData[0][header].PM_Reqmnt_test_Max || "-");
                const rows = mergedData.map(entry => {
                    return headerss.map(header => entry[header].value);
                });
                console.log(headerss)
                setMinRow(minValues)
                setMaxRow(maxValues)

                // setTestDetails(rows)

                const response1 = await axios.get(`${Environment.BaseAPIURL}/api/User/GETInstrumentDetailsByReportId?ReportId=${pm_processtype_id1}`);
                const data1 = response1.data[0]
                setInstrumentDetails(data1);

            } catch (error) {
                console.error('Error fetching report data:', error);
            }
            try {
                if (tstmaterialid) {
                    const [id1, id2] = tstmaterialid.split('&');
                    const response = await axios.get(`${Environment.BaseAPIURL}/api/User/GetInspectedByAcceptedByDetails?matid=${pm_processtype_id1}&testId=${id2}`);
                    const data = response.data
                    setSignatureReport(data)
                    callWitness()
                }
            } catch (error) {
                console.error('Error fetching report data:', error);
            }
        };
        fetchData();
    }, []);

    const groupWitnessesByPipeCode = (witnesses) => {
        return witnesses.reduce((acc, witness) => {
            if (!acc[witness.pm_pipe_seq_no]) {
                acc[witness.pm_pipe_seq_no] = [];
            }
            acc[witness.pm_pipe_seq_no].push({
                name: witness.co_param_val_name,
                initials: getInitials(witness.co_param_val_name),
                role: witness.RoleName
            });
            return acc;
        }, {});
    };

    useEffect(() => {
        const currentDate = new Date().toISOString().split('T')[0];
        setFormData(prevData => ({ ...prevData, pm_approved_on: currentDate }));
    }, []);

    const handlePrint = () => {
        window.print();
    };

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
        // setFormData({ ...formData, pm_approver_status: status });
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
            showRemarks ? <div className='RemarksFlexBox'>
                <label htmlFor="">Remarks</label>
                <input name="pm_remarks" className="form-control" value={formData.pm_remarks} onChange={handleChange} type="text" placeholder="Enter Approval/Rejection Remarks...." autoComplete="off" />
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
                        <label htmlFor="">
                            Select Witness <b>*</b>
                        </label>
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
                    {/* <div className="col-md-4 col-sm-4 col-xs-12">
                        <div className='form-group'>
                            <label htmlFor="">Date of First Approval</label>
                                                                    <span>: &nbsp;</span>
                            <h4>{headerDetails.first_approval_date || "05/30/2024"}</h4>
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-4 col-xs-12">
                        <div className='form-group'>
                            <label htmlFor="">Remarks</label>
                                                                    <span>: &nbsp;</span>
                            <h4>{headerDetails.first_approval_remarks || "Remarks"}</h4>
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-4 col-xs-12">
                        <div className='form-group'>
                            <label htmlFor="">Approval Status</label>
                                                                    <span>: &nbsp;</span>
                            <h4>{headerDetails.first_approval_status || "Approval Status"}</h4>
                        </div>
                    </div> */}
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
        console.log(formData, formData.pm_approver_status, 264)
        if (showRemarks) {
            if (formData?.pm_remarks == '' || isClicked == false) {
                toast.error("Please enter remarks and status")
                return
            }
        }
        const checkCount = parseInt(checkedCount)
        const testDetail = parseInt(testDetails.length)
        console.log(testDetail)
        const regPercs = parseInt(regPerc)

        if (showWitness && !witnessSelected && pm_Approve_level1 != "second") {
            toast.error('Please select a witness before submitting the form.');
            return;
        }
        if (pm_Approve_level1 == "second" && regPerc != 100) {
            if (checkCount / testDetail * 100 < regPercs) {
                toast.error(`Please check atleast ${Math.ceil((regPercs / 100) * testDetail)} data`)
                return
            }
        }

        function getPipeNosByIds(checkedItems, testDetails) {
            return checkedItems
                .map((id, index) => id ? testDetails[index]["Pipe No."] : null)
                .filter(pipeNo => pipeNo !== null);
        }

        // Example usage
        const pipeNos = getPipeNosByIds(checkedItems, testDetails);
        console.log(pipeNos)
        // setFormData((...prevData) => [{ prevData, checkedPipes: pipeNos }])
        console.log(formData)

        try {
            const response = await fetch(Environment.BaseAPIURL + "/api/User/InspectionSheetApproval", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ formData, 'checkedPipes': pipeNos ? pipeNos : '' }),
            });

            const responseBody = await response.text();

            if (responseBody === '100' || responseBody === '200') {
                toast.success('Status Updated Successfully!');
                navigate(`/blastingsheetlist?menuId=${menuId1}`)
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

    function condenseData(input) {
        // Split the input string into an array
        let dataArray = input?.split(',');

        // Extract the common prefix
        let commonPrefix = dataArray[0]?.slice(0, -2);

        // Extract the unique numbers
        let uniqueNumbers = dataArray?.map(item => item.split('-').pop());

        // Join the unique numbers into a single string
        let result = commonPrefix + '' + uniqueNumbers.join(', ');

        return result;
    }

    useEffect(() => {
        // fetchData();
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 3000);
    }, []);

    // ----------------------------------------------------

    const processedMaterials = rawMaterial.map(item => ({
        materialName: item.materialName === 'Chromate' ? 'Chromate' : 'Chromate',
        grade: item.materialName === 'Chromate' ? item.grade : '-',
        manufacturerName: item.materialName === 'Chromate' ? item.manufacturerName : '-',
        batch: item.materialName === 'Chromate' ? item.batch : '-',
    }));

    const chunkAndPadArray = (array, chunkSize) => {
        const chunks = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            const chunk = array.slice(i, i + chunkSize);
            while (chunk.length < chunkSize) {
                chunk.push({ someData: "-" });
            }
            chunks.push(chunk);
        }
        return chunks;
    };

    const chunkedData = chunkAndPadArray(testDetails, 10);

    const handleDownloadPDF = () => {
        const element = contentRef.current;
        const opt = {
            margin: [10, 10, 10, 10],
            filename: `Coating-application-report-${headerDetails.current?.procSheetNo}-${new Date().toLocaleDateString('en-GB').replace(/\//g, "-")}.pdf`,
            image: { type: 'jpeg', quality: 1.0 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
    };
    function convertDate(dateStr) {
        console.log(dateStr);
        const [year, month, day] = dateStr.split('-');
        const formattedDate = `${day}/${month}/${year}`;
        return formattedDate
    }

    return (
        <>
            {
                loading ?
                    <Loading />
                    :
                    <>
                        <div>
                            <div className="DownloadPrintFlexSection">
                                <h4 onClick={handleDownloadPDF}>
                                    <i className="fas fa-download"> </i> Download PDF
                                </h4>
                                <h4 onClick={handlePrint}>
                                    <i className="fas fa-print"></i> Print
                                </h4>
                            </div>
                            <div ref={contentRef}>
                                {chunkedData.map((chunk, chunkIndex) => (
                                    <div key={chunkIndex} className='InspReportSection' ref={contentRef} style={{ pageBreakAfter: 'always' }}>
                                        <div className='container-fluid'>
                                            <div className='row'>
                                                <div className='col-md-12 col-sm-12 col-xs-12'>
                                                    <div className='CustomChromateWitnessFlex'>
                                                        <div className='InspReportBox PotraitChromateSectionPage'>

                                                            <HeaderDataSection reportData={headerDetails.current} />

                                                            <section className='Reportmasterdatasection'>
                                                                <div className='container-fluid'>
                                                                    <form className='row'>
                                                                        <div className='col-md-7 col-sm-6 col-xs-12'>
                                                                            <div className='form-group'>
                                                                                <label htmlFor="">Client</label>
                                                                                <span>: &nbsp;</span>
                                                                                <h4 style={{ textTransform: 'uppercase' }}>{headerDetails.current.clientName}</h4>
                                                                            </div>
                                                                        </div>
                                                                        <div className='col-md-5 col-sm-6 col-xs-12'>
                                                                            <div className='form-group'>
                                                                                <label htmlFor="">Report No.</label>
                                                                                <span>: &nbsp;</span>
                                                                                <h4>{headerDetails.current?.reportAlias}/{reportTestDate} - {String(chunkIndex + 1).padStart(2, '0')} {headerDetails?.current.reportPqt == '' ? '' : (
                                                                                    <> ({headerDetails.current.reportPqt})</>
                                                                                )} </h4>
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
                                                                                <h4 style={{ textTransform: 'uppercase' }}>{headerDetails.current?.dateShift}</h4>
                                                                            </div>
                                                                        </div>
                                                                        <div className='col-md-7 col-sm-6 col-xs-12'>
                                                                            <div className='form-group'>
                                                                                <label htmlFor="">Specification</label>
                                                                                <span>: &nbsp;</span>
                                                                                <h4>{headerDetails.current?.specification}</h4>
                                                                            </div>
                                                                        </div>
                                                                        <div className='col-md-5 col-sm-6 col-xs-12'>
                                                                            <div className='form-group'>
                                                                                <label htmlFor="">Pipe Size</label>
                                                                                <span>: &nbsp;</span>
                                                                                <h4>{headerDetails.current?.pipeSize}</h4>
                                                                            </div>
                                                                        </div>
                                                                        <div className='col-md-7 col-sm-6 col-xs-12'>
                                                                            <div className='form-group'>
                                                                                <label htmlFor="">Acceptance Criteria</label>
                                                                                <span>: &nbsp;</span>
                                                                                <h4>{headerDetails.current?.acceptanceCriteria}</h4>
                                                                            </div>
                                                                        </div>
                                                                        <div className='col-md-5 col-sm-6 col-xs-12'>
                                                                            <div className='form-group'>
                                                                                <label htmlFor="">Type Of Coating</label>
                                                                                <span>: &nbsp;</span>
                                                                                <h4>{headerDetails.current?.typeofCoating}</h4>
                                                                            </div>
                                                                        </div>
                                                                        <div className='col-md-7 col-sm-6 col-xs-12'>
                                                                            <div className='form-group'>
                                                                                <label htmlFor="">Process Sheet</label>
                                                                                <span>: &nbsp;</span>
                                                                                <h4>{headerDetails.current?.procSheetNo} REV.  {headerDetails.current?.procesheet_revisionno
                                                                                    ? String(headerDetails.current.procesheet_revisionno).padStart(2, '0')
                                                                                    : '00'}  {headerDetails.current?.procesheet_revisionno ? "DATE : " + convertDate(headerDetails.current?.procesheet_revisiondate.split("T")[0]) : ''}</h4>
                                                                            </div>
                                                                        </div>
                                                                        <div className='col-md-5 col-sm-6 col-xs-12'>
                                                                            <div className='form-group'>
                                                                                <label htmlFor="">Procedure / WI No.</label>
                                                                                <span>: &nbsp;</span>
                                                                                <h4>{headerDetails.current?.wino && condenseData(headerDetails.current.wino) || "-"}</h4>
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
                                                                                    <table className='ChromateReportCustomTable'>
                                                                                        <thead>
                                                                                            <tr>
                                                                                                <th colSpan={3} style={{ width: '190px' }}>PIPE DATA</th>
                                                                                                <th colSpan={3} style={{ width: '308px' }}>CHROMATE APPLICATION</th>
                                                                                                <th colSpan={7} style={{ width: '718px' }}>COATING APPLICATION</th>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <th>S. NO.</th>
                                                                                                <th>PIPE NO.</th>
                                                                                                <th>ASL NO.</th>
                                                                                                <th>PIPE TEMP. BEFORE CHROMATE(°C)</th>
                                                                                                <th>VISUAL OF CHROMATE APPLICATION</th>
                                                                                                <th>CHROMATE SOLUTION TEMP.(°C)</th>
                                                                                                <th>PIPE TEMP AFTER CHROMATE APPLICATION(°C)</th>
                                                                                                <th>PIPE TEMP BEFORE FBE APPLICATION(°C)</th>
                                                                                                <th>ADHESIVE FILM TEMP.(°C)</th>
                                                                                                <th>PE/PP FILM TEMP.(°C)</th>
                                                                                                <th>WATER TEMP. BEFORE QUENCHING</th>
                                                                                                <th>WATER TEMP. AFTER QUENCHING</th>
                                                                                                <th>REMARKS</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody>
                                                                                            <tr>
                                                                                                <th colSpan="2" rowSpan={2} style={{ textTransform: 'uppercase' }}>Specified Requirement</th>
                                                                                                <th>MIN</th>
                                                                                                {minRow?.slice(3)?.map((item, rowIndex) => (
                                                                                                    <td style={{ fontWeight: '900' }} key={rowIndex}>{item}</td>
                                                                                                ))}
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <th>MAX</th>
                                                                                                {console.log(maxRow)
                                                                                                }
                                                                                                {maxRow?.slice(3)?.map((item, rowIndex) => (
                                                                                                    <td key={rowIndex}>{item}</td>
                                                                                                ))}
                                                                                            </tr>
                                                                                            {/* {testDetails?.map((item, rowIndex) => (
                                                                                    <tr key={rowIndex}>
                                                                                        <td key={rowIndex}>{rowIndex + 1}</td>
                                                                                        {headers.map((header, colIndex) => (
                                                                                            <td key={colIndex}>{header}</td>
                                                                                        ))}
                                                                                    </tr>
                                                                                ))} */}

                                                                                            {chunk?.map((row, rowIndex) => {
                                                                                                const hasData = Object.values(row).some(value => value !== undefined && value !== null && value !== '-');
                                                                                                console.log(chunk);

                                                                                                return (
                                                                                                    <tr key={rowIndex}>
                                                                                                        {/* {hasData ? <td key="srNo">{rowIndex + 1}</td> : <td key="srNo">{"-"}</td>} */}
                                                                                                        {headers
                                                                                                            ?.filter(cell => !/^Airpressure_[AB][1-9]\d?$|^Flowrate_[AB][1-9]\d?$|^(LineSpeed|DewPointforCoating|HdpeScrewRpm1|HdpeScrewRpm2|AdhesiveScrewRpm)$/.test(cell)) // Exclude specified keys
                                                                                                            .map((cell, cellIndex) => (
                                                                                                                <td key={cellIndex}>
                                                                                                                    {row[cell] !== undefined && row[cell] !== null && row[cell] !== '-' && row[cell] !== '0' ? row[cell] == "" ? "NTC" : row[cell] == "Select" ? "Ok" : row[cell] : '-'}
                                                                                                                </td>
                                                                                                            ))}
                                                                                                    </tr>
                                                                                                );
                                                                                            })}
                                                                                            {/* {chunk?.map((row, rowIndex) => (
                                                                                            <tr key={rowIndex}>
                                                                                                <td key={rowIndex}>{rowIndex + 1}</td>
                                                                                                {headers?.map((cell, cellIndex) => (
                                                                                                    <td key={cellIndex}>{row[cell]}{row.someData}</td>
                                                                                                ))}
                                                                                            </tr>
                                                                                        ))} */}
                                                                                        </tbody>
                                                                                    </table>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </section>
                                                            )}

                                                            {Array.isArray(epoxyGuns) && epoxyGuns.length > 0 && (
                                                                <section className='ReporttableSection'>
                                                                    <div className='container-fluid'>
                                                                        <div className='row'>
                                                                            <div className='col-md-12 col-sm-12 col-xs-12'>
                                                                                <div id='custom-scroll'>
                                                                                    <table>
                                                                                        <thead>
                                                                                            <tr>
                                                                                                <th style={{ width: '190px', borderTop: 'none' }}>Number of Epoxy Guns</th>
                                                                                                {console.log(epoxyGuns.length)}
                                                                                                {epoxyGuns.map((data, index) => (
                                                                                                    <th style={{ borderTop: 'none' }} key={index}>{data}</th>
                                                                                                ))}
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody>
                                                                                            <tr>
                                                                                                <th>AIR PRESSURE Kg/cm²</th>
                                                                                                {console.log(epoxyGunsList.length)}
                                                                                                {/* {epoxyGunsList?.map((item, rowIndex) => ( */}
                                                                                                {epoxyGunsList.map((gun, index) => (
                                                                                                    <td key={gun.id}>
                                                                                                        {console.log(index)}
                                                                                                        {gun.Airpressure == '0' || gun.Airpressure == '' ? '-' : gun.Airpressure}
                                                                                                    </td>
                                                                                                ))}
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <th>FLOW RATE %</th>
                                                                                                {epoxyGunsList?.map(item => (
                                                                                                    <>
                                                                                                        <td>{item.Flowrate == '0' || item.Flowrate == '' ? '-' : item.Flowrate}</td>
                                                                                                    </>
                                                                                                ))}
                                                                                            </tr>
                                                                                        </tbody>
                                                                                    </table>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </section>
                                                            )}

                                                            <ReportRemarks reportData={headerDetails.current.testRemarks} />

                                                            <section className='ReporttableSection'>
                                                                <div className='container-fluid'>
                                                                    <div className='row'>
                                                                        <div className='col-md-12 col-sm-12 col-xs-12'>
                                                                            <div id='custom-scroll'>
                                                                                <table>
                                                                                    <thead>
                                                                                        <tr>
                                                                                            <th colSpan={11} style={{ textAlign: 'left', borderBottom: "none", padding: '2px 12px' }}>ABOVE RESULTS ARE CONFORMING TO SPECIFICATION :-
                                                                                                <span style={{ fontFamily: 'Myriad Pro Light' }}> {headerDetails.current?.specification} REV. 03 DATED: 19.09.2017 & QAP NO.- {headerDetails.current?.acceptanceCriteria} AND FOUND SATISFACTORY    </span>
                                                                                            </th>
                                                                                        </tr>
                                                                                    </thead>
                                                                                </table>
                                                                            </div>
                                                                        </div>
                                                                    </div>
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
                                                                                            <th colSpan={11} style={{ fontSize: '10px', textAlign: 'left', paddingLeft: '10px' }}>Raw Material Used:</th>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <th style={{ minWidth: '70px' }}>Sr. No.</th>
                                                                                            <th style={{ minWidth: '150px' }}>Raw Material</th>
                                                                                            <th style={{ minWidth: '150px' }}>Manufacturer</th>
                                                                                            <th style={{ minWidth: '200px' }}>Grade</th>
                                                                                            <th style={{ minWidth: '40px' }}>Batch No.</th>
                                                                                            <th style={{ minWidth: '40px' }}>Line Speed Mtr. / Min.</th>
                                                                                            <th style={{ minWidth: '40px' }}>Dew Point of Air for Coating Application (°C)</th>
                                                                                            <th style={{ minWidth: '40px' }}>No of Epoxy Gun</th>
                                                                                            <th colSpan={2} style={{ minWidth: '40px' }}>HDPE Screw RPM</th>
                                                                                            <th style={{ minWidth: '40px' }}>Adhesive Screw RPM</th>
                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody>
                                                                                        {[
                                                                                            { material: 'Chromate' },
                                                                                            { material: 'Fusion Bonded Epoxy' },
                                                                                            { material: 'Adhesive' },
                                                                                            { material: 'High Density Polyethylene' },
                                                                                        ].map((material, rowIndex) => {
                                                                                            const matchedMaterial = rawMaterial.find(
                                                                                                item => item.materialName === material.material
                                                                                            );

                                                                                            return (
                                                                                                <tr key={rowIndex}>
                                                                                                    <td>{rowIndex + 1}</td>
                                                                                                    <td>{material.material}</td>
                                                                                                    <td>{matchedMaterial ? matchedMaterial.manufacturerName : '-'}</td>
                                                                                                    <td>{matchedMaterial ? matchedMaterial.grade : '-'}</td>
                                                                                                    <td>{matchedMaterial ? matchedMaterial.batch : '-'}</td>
                                                                                                    {rowIndex === 0 && (
                                                                                                        <>
                                                                                                            <td rowSpan={4}>{testDetails ? testDetails[0]['LineSpeed'] : '-'}</td>
                                                                                                            <td rowSpan={4}>{testDetails ? testDetails[0]['DewPointforCoating'] : '-'}</td>
                                                                                                            <td rowSpan={4}>{airPressureLength}</td>
                                                                                                        </>
                                                                                                    )}
                                                                                                    {rowIndex === 0 && (
                                                                                                        <>
                                                                                                            <td>1</td>
                                                                                                            <td>2</td>
                                                                                                        </>
                                                                                                    )}
                                                                                                    {rowIndex === 1 && (
                                                                                                        <>
                                                                                                            <td rowSpan={4}>{testDetails ? testDetails[0]['HdpeScrewRpm1'] : '-'}</td>
                                                                                                            <td rowSpan={4}>{testDetails ? testDetails[0]['HdpeScrewRpm2'] : '-'}</td>
                                                                                                        </>
                                                                                                    )}
                                                                                                    {rowIndex === 0 && (
                                                                                                        <td rowSpan={4}>{testDetails ? testDetails[0]['AdhesiveScrewRpm'] : '-'}</td>
                                                                                                    )}
                                                                                                </tr>
                                                                                            );
                                                                                        })}
                                                                                    </tbody>
                                                                                </table>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </section>

                                                            {instrumentDetails ?
                                                                <section className="InstrumentusedSection">
                                                                    <div className="container-fluid">
                                                                        <div className="row">
                                                                            <div className="col-md-12 col-sm-12 col-xs-12">
                                                                                <table id="instrument-table">
                                                                                    <thead>
                                                                                        <tr>
                                                                                            <td colSpan={instrumentDetails?.length * 2}>
                                                                                                USED INSTRUMENT
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            {instrumentDetails?.map((data) => {
                                                                                                return (
                                                                                                    <>
                                                                                                        <td>INSTRUMENT NAME</td>
                                                                                                        <td>INSTRUMENT ID</td>
                                                                                                    </>
                                                                                                )
                                                                                            })}
                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody>
                                                                                        <tr>
                                                                                            {instrumentDetails?.map((data) => {
                                                                                                return (
                                                                                                    <>
                                                                                                        <td>{data.equip_code}</td>
                                                                                                        <td>{data.equip_name}</td>
                                                                                                    </>
                                                                                                )
                                                                                            })}
                                                                                        </tr>
                                                                                    </tbody>
                                                                                    {/* <thead>
                                                                                        <tr>
                                                                                            <th colSpan={instrumentDetails.length * 2} style={{ textAlign: 'center', fontSize: '14px' }}>  USED INSTRUMENT</th>
                                                                                        </tr>
                                                                                    </thead>
                                                                                    <thead id="table-head">
                                                                                    </thead>
                                                                                    {tableBody?.map((instrument, index) => (
                                                                                        <li key={index}>
                                                                                            {instrument.name} - {instrument.code}
                                                                                        </li>
                                                                                    ))}
                                                                                    <tbody id="table-body">
                                                                                    </tbody> */}
                                                                                </table>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </section>
                                                                : ''}
                                                            {/* <InstrumentusedSection reportType={"blasting"} reportData={instrumentDetails} /> */}

                                                            <Footerdata data={signatureReport} witness={randomWitnesses} />

                                                        </div>
                                                        <div className='CustomBarePipeWitnessBox'>
                                                            <div className='CustomBarePipeWitnessBox1'></div>
                                                            <div
                                                                className='CustomBarePipeWitnessBox2'
                                                                style={{ height: witnessHeight }}
                                                                ref={refDivB}
                                                            ></div>
                                                            <div className='CustomBareWitnessBox'>
                                                                {/* <span></span> */}
                                                                <div>
                                                                    <div className='RemarksCustomHeight2'></div>
                                                                    {chunk?.map((row, rowIndex) => {
                                                                        const hasData = Object.values(row).some(value => value !== undefined && value !== null && value !== '-');
                                                                        console.log(witnessesByPipeCode, "rowata")
                                                                        return (
                                                                            <div key={rowIndex} className='Approvelevel1FlexBox1'>
                                                                                {witnessesByPipeCode[row["Sr. No."]] ?
                                                                                    <div className='Approvelevel1Flex'>
                                                                                        <span className='CustomBorderLine1'></span>
                                                                                        {witnessesByPipeCode[row["Sr. No."]].map((witness, index) => (
                                                                                            <div id={index} key={index} className='witnessesByPipeDiv'>
                                                                                                <p title={witness.full_name}>&nbsp;&nbsp; <span style={{ border: '1px solid', borderRadius: '50%', padding: '2px 4px' }}>W</span> <b>-</b> {witness.initials}
                                                                                                </p>
                                                                                            </div>
                                                                                        ))}
                                                                                    </div> : ''
                                                                                }
                                                                                {/* {pm_Approve_level1 == "second" && regPerc != 100 ?
                                                                                    <div className='Approvelevel1Flex' id={rowIndex}>{!row.someData ?
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            checked={checkedItems[rowIndex]}
                                                                                            onChange={() => handleCheckboxChange(rowIndex)}
                                                                                        /> : ''
                                                                                    }
                                                                                    </div> : ''} */}
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                            <div style={{ height: '229px' }}></div>
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
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
            }
        </>
    );
}

export default ChromateCoatInsp;