import React, { useState, useEffect, useRef } from 'react';
import Header from '../../Common/Header/Header'
import Footer from '../../Common/Footer/Footer';
import Loading from '../../Loading';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Environment from "../../../environment";
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
import '../Allreports.css';
import './Repair.css'

var excludedPipes = []
function Repair() {
    const [inputValues, setInputValues] = useState([]);
    const [remarkValues, setRemarkValues] = useState([]);
    const [year, setYear] = useState('');
    const [type, setType] = useState('');
    const [instrumentData, setInstrumentData] = useState([]);
    const [usedInstrument, setusedInstrument] = useState()
    const [headerData, setHeaderData] = useState({});
    const navigate = useNavigate();
    const [isPqt, setIsPqt] = useState(false);
    const [tableData, setTableData] = useState([])
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const menuId = queryParams.get('menuId');
    const [shift, setShift] = useState()
    const [testRunId, setTestRunId] = useState()
    const userId = secureLocalStorage.getItem('userId');
    const [selectedProcedures, setSelectedProcedures] = useState([]);
    const searchParams = new URLSearchParams(window.location.search);
    const pm_test_run_id = searchParams.get("pm_test_run_id");
    const procsheetId = searchParams.get("processsheetId");
    const action = searchParams.get("action");
    const [witnessList, setWitnessList] = useState([])
    const [pipeData, setPipeData] = useState([])

    const handleTypeChange = (e) => {
        const { name, value } = e.target;
        if (name === "year") {
            setYear(value);
        } else {
            setType(value);
        }
    };

    const getRepairDataById = async (data1, data2) => {
        const response = await axios.get(`${Environment.BaseAPIURL}/api/User/GetRepairDataById?processsheet_id=${type}&processtype=1428&TestDate=${data1}&shiftid=${data2}`);
        console.log(response.data)
        setPipeData(response.data[0])

        const response2 = await axios.get(Environment.BaseAPIURL + `/api/User/GetWiTestList?sub_test_id=0&test_id=${1428}`)
        const procedures = response2?.data.map(item => ({ value: item.work_instr_id, label: item.workinst_doc_id }));

        setSelectedProcedures(procedures);

        const response3 = await axios.get(`${Environment.BaseAPIURL}/api/User/GETInstrumentDetailsByReportId?ReportId=${1428}`);
        const data = response3.data[0]
        setInstrumentData(data);
    }

    const handleTypeBlur = () => {
        callApi();
    }

    const callApi = async () => {
        try {
            if (year && type) {
                const response = await axios.post(`${Environment.BaseAPIURL}/api/User/getEPOXYProcessSheetDetails?processsheetno=${type}&year=${year}`);
                const firstDataItem = response.data.Table[0];
                setShift(response.data.Table5[0])
                setHeaderData(firstDataItem || []);

                if (response.data) {
                    getRepairDataById(firstDataItem.testdate, response.data.Table5[0].pm_shift_id)
                }
            } else {
                console.error('Invalid year or type:', year, type);
            }
        } catch (error) {
            console.error('Error fetching process sheet details:', error);
        }
    };

    const [loading, setLoading] = useState(false);
    useEffect(() => {
        getYear();
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 2000);
    }, [])

    const [ddlYear, setddlYear] = useState([]);

    const getYear = async () => {
        const response = await axios.get(Environment.BaseAPIURL + "/api/User/getprocsheetyear")
        const sortedYears = response.data.sort((a, b) => b.year - a.year);
        setddlYear(sortedYears);

        if (action == 'edit') {
            const response1 = await axios.post(Environment.BaseAPIURL + `/api/User/GetRepairDataByTestRunId?processsheet_id=${procsheetId}&pm_test_run_id=${pm_test_run_id}`)
            setHeaderData(response1?.data[0][0])
            setTableData(response1?.data)
            setTestRunId(response1?.data[0][0]?.pm_test_run_id)


            const response2 = await axios.get(Environment.BaseAPIURL + `/api/User/GetWiTestList?sub_test_id=0&test_id=${1428}`)
            const procedures = response2?.data.map(item => ({ value: item.work_instr_id, label: item.workinst_doc_id }));

            setSelectedProcedures(procedures);

            const response3 = await axios.get(`${Environment.BaseAPIURL}/api/User/GETInstrumentDetailsByReportId?ReportId=${1428}`);
            const data = response3.data[0]
            setInstrumentData(data);

            initializeResultSuffixInput(response1)
        }
    };

    const initializeResultSuffixInput = (response, response2) => {
        let updatedInputValues = {};
        let updatedRemarkValues = {};
        let tpiCheckboxValues = {};
        const updatedCheckboxState = {};
        let updatedSampleInput = {};
        let updatedResultMessage = {};

        for (var i = 0; i < response?.data[2].length; i++) {
            const key = `${i}`; // Assuming rowIndex is 0 for initialization
            updatedInputValues[key] = response?.data[2][i].pm_test_value2;
            updatedRemarkValues[key] = response?.data[2][i].pm_test_result_remarks;
        }

        for (var i = 0; i < response2?.length; i++) {
            // {
            //     "3-TPI- Arif Muhammad": false,
            //     "2-TPI- Arif Muhammad": false,
            //     "4-TPI- Arif Muhammad": true
            // }
            const key = `${i}`; // Assuming rowIndex is 0 for initialization
            updatedInputValues[key] = response?.data[2][i].pm_test_value2;
        }

        setInputValues(updatedInputValues)
        setRemarkValues(updatedRemarkValues)
    }

    const handleSubmit = async (e, value) => {
        e.preventDefault()
        const repairData = pipeData
            .flatMap((item, index) => {
                const key = `${index}`;
                return {
                    ...item,
                    inputValue: inputValues[key] || '0',
                    remarkValues: remarkValues[key] || '0',
                    index
                };
            })
            .map(entry => ({
                pipe_id: entry.pm_pipe_id.toString(),
                seqno: entry.pm_seqno.toString(),
                pm_rfid_data_id: entry.pm_rfiddata_id.toString(),
                reasonofDamage: entry.Reason,
                repairArea: entry.inputValue,
                visual: entry.remarkValues,
                holiday: "25Kv",
                remarks: "Ok",
                pm_shift_id: shift.pm_shift_id.toString(),
                pm_coatingdate: entry.date,
            }
            ));

        const dataToSend = {
            project_id: headerData.projectid.toString(),
            procsheet_id: headerData.processsheetid.toString(),
            shiftID: shift.pm_shift_id.toString(),
            ispqt: headerData.ispqt === true ? "1" : "0",
            created_by: userId.toString(),
            process_type: "1428",
            procedure_type: selectedProcedures ? selectedProcedures.map(proc => proc.value).join(',') + "," : '0',
            repairData,
            instrumentData,
            co_comp_id: '1',
            co_location_id: '1',
            p_test_run_id: '0',
        };

        try {
            const response = await axios.post(Environment.BaseAPIURL + '/api/User/SaveRepairDetails', dataToSend);
            toast.success('Form submitted successfully!');
            navigate(``);
            if (response.data === "100") {
                toast.success("Form data sent successfully!");
                console.log("Form data sent successfully!");
                navigate(`/repair-list?menuId=${menuId}`);
            } else {
                console.error("Failed to send form data to the server. Status code:", response.status);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Failed to submit the form.');
        }
    };



    const handleInputChange = (e, index) => {
        const { value } = e.target;
        let newInputValues = { ...inputValues }; // Copy current input values

        // If it's the first row (index === 0), set all to the first row's value
        if (index === 0) {
            Object.keys(newInputValues).forEach((key) => {
                newInputValues[key] = value; // Set all input values to the first row's value
            });
        } else {
            newInputValues[index] = value; // Update only the corresponding row
        }
        console.log(newInputValues)
        setInputValues(newInputValues); // Update state
    };
    const handleRemarksChange = (e, index) => {
        const { value } = e.target;
        let newRemarkValues = [...remarkValues]; // Copy current remark values

        // If it's the first row (index === 0), set all remarks to the first row's remark value
        if (index === 0) {
            newRemarkValues = newRemarkValues.map((remark, i) => {
                return i === 0 || remark !== value ? value : remark; // Set all to the first row's remark value
            });
        } else {
            newRemarkValues[index] = value; // Update only the corresponding row
        }

        setRemarkValues(newRemarkValues); // Update state
    };



    function excludePipe(data) {
        excludedPipes.push(data.data["pipe_id"])
    }

    function handlePQTChange() {
        if (isPqt === false) {
            setIsPqt(true);
        } else {
            setIsPqt(false);
        }
    }

    const witnessMap = witnessList?.reduce((acc, witness) => {
        acc[witness.pm_pipe_id] = witness.pm_random_witness_id;
        return acc;
    }, {});

    const mergedData = tableData[2]?.map(item => {
        return {
            ...item,
            pm_random_witness_id: witnessMap[item.pm_pipe_id] || null // default to null if not found
        };
    });

    return (
        <>
            {
                loading ? <Loading /> :
                    <>
                        <Header />
                        <section className="InnerHeaderPageSection">
                            <div className="InnerHeaderPageBg"></div>
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-12 col-sm-12 col-xs-12">
                                        <ul>
                                            <li>
                                                <Link to="/dashboard?moduleId=618">Quality Module</Link>
                                            </li>
                                            <li><h1>/&nbsp;</h1></li>
                                            <li>&nbsp;<Link to={`/blastingsheetlist?menuId=${menuId}`}>&nbsp;Process Data Entry List</Link></li>
                                            <li>
                                                <h1>/&nbsp; Process Data Entry </h1>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section className='TallytagmappingPageSection'>
                            <div className='container'>
                                <div className='row'>
                                    <div className='col-md-12 col-sm-12 col-sm-12'>
                                        <div className='PipeTallySheetDetails'>
                                            <form className='row m-0'>
                                                <div className='col-md-12 col-sm-12 col-xs-12'>
                                                    <h5>Inlet Data Entry <span>- Add page</span></h5>
                                                </div>
                                                <div className='col-md-4 col-sm-4 col-xs-12'>
                                                    <div className='form-group'>
                                                        <label htmlFor="processSheet">Process Sheet</label>
                                                        <div className='ProcessSheetFlexBox'>
                                                            <input id="processSheet" style={{ width: '66%', cursor: 'not-allowed' }} value={action != 'edit' ? headerData.processsheetcode : headerData.pm_procsheet_code} placeholder='Process sheet no.' readOnly />
                                                            <select name="year" value={year} onChange={handleTypeChange} >
                                                                <option value=""> Year </option>
                                                                {ddlYear.map((coatingTypeOption, i) => (
                                                                    <option key={i} value={coatingTypeOption.year}> {coatingTypeOption.year} </option>
                                                                ))}
                                                            </select>
                                                            <b>-</b>
                                                            <input id="type" type="text" placeholder='No.' value={type} onChange={handleTypeChange} onBlur={handleTypeBlur} />
                                                        </div>
                                                    </div>
                                                </div>
                                                {[
                                                    { id: 'clientName', label: 'Client Name', value: headerData?.clientname != undefined ? headerData?.clientname : '' },
                                                    { id: 'pipeSize', label: 'Pipe Size', value: headerData?.pipesize != undefined ? headerData?.pipesize : '' },
                                                    { id: 'dated', label: 'Date', value: new Date(headerData?.testdate).toLocaleDateString('en-GB') != undefined ? new Date(action != 'edit' ? headerData?.testdate : headerData?.test_date).toLocaleDateString('en-GB') : '' },
                                                    { id: 'shift', label: 'Shift', value: shift?.pm_shiftvalue != undefined ? shift?.pm_shiftvalue : '' },
                                                ].map(field => (
                                                    <div key={field.id} className='col-md-4 col-sm-4 col-xs-12'>
                                                        <div className='form-group'>
                                                            <label htmlFor={field.id}>{field.label}</label>
                                                            <input
                                                                id={field.id}
                                                                type='text'
                                                                value={field.value}
                                                                placeholder={field.label}
                                                                style={{ cursor: 'not-allowed' }}
                                                                readOnly
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                                <div className='col-md-4 col-sm-4 col-xs-12'></div>

                                                <div className="col-md-12 col-sm-12 col-xs-12">
                                                    <div className="d-flex align-items-center">
                                                        <div className="PQTBox">
                                                            <input
                                                                type="checkbox"
                                                                id="ispqt"
                                                                name="ispqt"
                                                                checked={isPqt}
                                                                onChange={handlePQTChange}
                                                            />
                                                            <label for="pqt"> PQT</label>
                                                        </div>
                                                    </div>
                                                </div>

                                                {pipeData?.length ?
                                                    <div className="col-md-12 col-sm-12 col-xs-12 mt-4 BlastingDataEntrySectionPage ">
                                                        <table style={{ borderCollapse: 'collapse', width: '100%', textAlign: 'center' }}>
                                                            <thead>
                                                                <tr>
                                                                    <th></th>
                                                                    <th></th>
                                                                    <th></th>
                                                                    <th></th>
                                                                    <th></th>
                                                                    <th colSpan={2}>Inspection of Repair Area</th>
                                                                </tr>
                                                                <tr>
                                                                    <th style={{ width: '60px' }}>S. No.</th>
                                                                    <th style={{ width: '100px' }}>Pipe No.</th>
                                                                    <th style={{ width: '100px' }}>Coating Date</th>
                                                                    <th style={{ width: '150px' }}>Reason of Damage</th>
                                                                    <th style={{ width: '160px' }}>Repair Area</th>
                                                                    <th style={{ width: '160px' }}>Visual</th>
                                                                    <th style={{ width: '160px' }}>Holiday</th>
                                                                </tr>
                                                            </thead>
                                                            {pipeData?.map((data, index) => {
                                                                const key = `${index}`;
                                                                return (
                                                                    <tbody>
                                                                        <td>{index + 1}</td>
                                                                        <td>{data?.pipino}</td>
                                                                        <td>{new Date(data.date).toLocaleDateString('en-GB').replace(/\//g, "-")}</td>
                                                                        <td>{data?.Reason == "Thickness" ? "Coating Damage" : data?.Reason}</td>
                                                                        <td>
                                                                            <input type='text' className='form-control' placeholder='Area' value={inputValues[key] || ''} onChange={(e) => handleInputChange(e, key)} />
                                                                        </td>
                                                                        <td>
                                                                            <input type='text' className='form-control' placeholder='Visual' value={remarkValues[key] || ''} onChange={(e) => handleRemarksChange(e, key)} />
                                                                        </td>
                                                                        <td>
                                                                            <input type='text' className='form-control' placeholder='Holiday' value={'25Kv'} />
                                                                        </td>
                                                                    </tbody>
                                                                )
                                                            })}
                                                        </table>
                                                        <div className='mt-4 FlexSubmitFlex'>
                                                            {/* <button className='btn btn-secondary mx-2' onClick={(e) => handleSubmit(e, false)}>Save Draft</button> */}
                                                            <button className='btn btn-primary' onClick={(e) => handleSubmit(e, true)}>Submit</button>
                                                        </div>
                                                    </div> : ''}

                                                {instrumentData?.length ?
                                                    <div className="col-md-12 col-sm-12 col-xs-12 mt-4">
                                                        <table style={{ width: '100%' }}>
                                                            <thead>
                                                                <tr
                                                                    style={{
                                                                        background: "#5a245a",
                                                                        color: "#fff !important",
                                                                    }}
                                                                >
                                                                    <th
                                                                        colSpan={3}
                                                                        style={{
                                                                            fontSize: "16px",
                                                                            textAlign: "center",
                                                                            color: '#fff'
                                                                        }}
                                                                    >
                                                                        {" "}
                                                                        Used Instrument
                                                                    </th>
                                                                </tr>
                                                                <tr
                                                                    style={{
                                                                        background: "#5a245a",
                                                                        color: "#fff",
                                                                    }}
                                                                >
                                                                    <td
                                                                        style={{
                                                                            maxWidth: "30px",
                                                                            background: "whitesmoke",
                                                                            color: "#000",
                                                                            border: '1px solid black',
                                                                            padding: '8px'
                                                                        }}
                                                                    >
                                                                        Sr. No.
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            maxWidth: "30px",
                                                                            background: "whitesmoke",
                                                                            color: "#000",
                                                                            border: '1px solid black',
                                                                            padding: '8px'
                                                                        }}
                                                                    >
                                                                        Instrument Name
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            minWidth: "30px",
                                                                            background: "whitesmoke",
                                                                            color: "#000",
                                                                            border: '1px solid black',
                                                                            padding: '8px'
                                                                        }}
                                                                    >
                                                                        Instrument ID/Serial No.
                                                                    </td>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {instrumentData?.map((tests, index) => (
                                                                    <tr key={index}>
                                                                        <td style={{ border: '1px solid black', padding: '8px' }}>{index + 1}</td>
                                                                        <td style={{ border: '1px solid black', padding: '8px' }}>{tests.equip_name}</td>
                                                                        <td style={{ border: '1px solid black', padding: '8px' }}>
                                                                            <input type='text' className='form-control' value={tests.equip_code} />
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    : ''}
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <Footer />
                    </>
            }
        </>
    )
}

export default Repair;