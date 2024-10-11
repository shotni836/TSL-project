import React, { useState, useEffect, useRef } from 'react';
import './Rawmaterial.css'
import { Table } from 'react-bootstrap';
import RegisterEmployeebg from '../../assets/images/RegisterEmployeebg.jpg';
import Header from '../Common/Header/Header';
import Footer from '../Common/Footer/Footer';
import Select from "react-select";
import Loading from '../Loading';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Environment from '../../environment';
import secureLocalStorage from 'react-secure-storage';
import DatePicker from 'react-datepicker';

function FieldTesting() {
    const userId = secureLocalStorage.getItem('empId');
    const searchParams = new URLSearchParams(document.location.search);
    let testingtype = searchParams.get('testingtype');
    let menuId = searchParams.get('menuId');
    let action = searchParams.get('action');
    let procSheetId = searchParams.get('ProcessSheetID');
    let TestRunId = searchParams.get('TestRunId');
    let ProcessSheetTypeID = searchParams.get('ProcessSheetTypeID');
    let TestId = searchParams.get('TestId');
    const roleId = secureLocalStorage.getItem('roleId')
    let testingtypeval = "";
    if (testingtype === "609") {
        testingtypeval = "In Process Field Testing";
    }

    const [loading, setLoading] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [numRows, setNumRows] = useState(1);
    const [ddlYear, setddlYear] = useState([]);
    const [formData, setFormData] = useState({
        psYear: '',
        psSeqNo: '',
        clientname: '',
        projectname: '',
        pipesize: '',
        coating_type: '',
        testdate: '',
        shift: '',
        ispqt: false,
    });

    const [disable, setDisable] = useState(false);
    const [testOption, setTestOption] = useState([]);
    const [procedures, setProcedures] = useState([]);
    const [selectedProcedures, setSelectedProcedures] = useState([]);
    const [frequency, setFrequency] = useState([]);
    const [frequencyDetails, setFrequencyDetails] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [instrumentData, setInstrumentData] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [continueCode, setContinueCode] = useState(false);
    const processSeqNo = useRef()
    const [inputCheckbox, setInputCheckbox] = useState({});
    const [sampleCheckbox, setSampleCheckbox] = useState({});
    const navigate = useNavigate();
    const [coatingDates, setCoatingDates] = useState([]);
    const [coatingSelectedDate, setCoatingSelectedDate] = useState(null);
    const [coatingDate, setCoatingDate] = useState(null);
    const [shift, setShift] = useState();

    useEffect(() => {
        fetchYear();
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 2000);
    }, [])

    const fetchEditDetails = async () => {
        const endpoint = TestId == '987' ? `GetPeeltestDataById` : `GetInProcessLabFieldTestingById`

        const response = await axios.get(`${Environment.BaseAPIURL}/api/User/${endpoint}?ProcessSheetID=${procSheetId}&ProcessSheetTypeID=${ProcessSheetTypeID}&TestRunId=${TestRunId}&TestId=${TestId}`)
        setFormData(response?.data[0][0]);
        setTableData(response?.data[1])
        setDisable(true);
        initializeResultSuffixInput(response)
        if (response?.data && response.data[1] && response.data[1][0]) {
            setSelectedTestId(response.data[1][0].pm_test_id);
        }
        const initialDateString = response?.data[1][0].thicknessDate;
        // const initialDateString = TestId != '987' ? response?.data[1][0].testdate;
        const initialDate = new Date(initialDateString);
        setCoatingSelectedDate(initialDate)
        setCoatingDate(response?.data[1][0].testdate)
        setFormData((prevData) => ({
            ...prevData,
            ispqt: response.data[0][0].pm_ispqt_id == 1 ? true : false,
        }))
        const procedureIds = response?.data[0][0].pm_Procedure_type_id.split(',').filter(value => value !== '').map(Number);
        const winoLabels = response?.data[0][0]?.WINO?.split(',');

        const procedures = procedureIds.map((id, index) => ({
            value: id,
            label: winoLabels[index] || ''
        }));
        setSelectedProcedures(procedures)
        setProcedures(procedures);

        const response2 = await axios.get(`${Environment.BaseAPIURL}/api/User/GETInstrumentDetailsByReportId?ReportId=${TestId}`);
        setInstrumentData(response2?.data[0]);

        fetchTestOption(response?.data[1][0].pm_test_id, response?.data[0][0].psSeqNo);
        // setFormData((prevData) => [{ ...prevData, process_type: response?.data[1][0].pm_test_id }])
    }

    const initializeResultSuffixInput = (response) => {
        let updatedResultSuffixInput = {};
        let updatedResultInput = {};
        let updatedTemperatureInput = {};
        const updatedCheckboxState = {};
        let updatedSampleInput = {};
        let updatedResultMessage = {};

        let fend = {};
        let middle = {};
        let tend = {};

        for (var i = 0; i < response?.data[1].length; i++) {
            const key = `${i}-0`; // Assuming rowIndex is 0 for initialization
            updatedResultSuffixInput[key] = response?.data[1][i].pm_test_result_suffix;
            updatedResultInput[key] = response?.data[1][i].pm_test_result_remarks;
            updatedTemperatureInput[key] = response?.data[1][i].pm_temperature1;
            updatedSampleInput[key] = response?.data[1][i].pm_sample_cut_size?.toString();
            updatedCheckboxState[key] = response?.data[1][i].pm_is_sample_cut === 1;
            // updatedSelectedOption[key] = response?.data[1][i].pm_reqmnt_temperature;
            // updatedInputCheckbox[key] = response?.data[1][i].pm_reqmnt_temperature;
            updatedResultMessage[key] = response?.data[1][i].pm_test_result_accepted == 1 ? 'Satisfactory' : 'Not Satisfactory';

            fend[key] = response?.data[1][i].pm_f_end;
            middle[key] = response?.data[1][i].pm_middle;
            tend[key] = response?.data[1][i].pm_t_end;
            setInputCheckbox(prevState => ({
                ...prevState,
                [key]: true,
            }));
        }

        setSampleCheckbox(prevState => ({
            ...prevState,
            ...updatedCheckboxState,
        }));

        setResultMessage(updatedResultMessage)
        TestId == 987 ? setResultInput(fend) : setResultInput(updatedResultInput);
        setTemperatureInput(updatedTemperatureInput)
        setSampleInput(updatedSampleInput)
        setResultSuffixInput(updatedResultSuffixInput);

        setResultInput1(middle);
        setResultInput2(tend);
    };

    const handleInputChange = (e) => {
        processSeqNo.current = e.target.value
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePsSeqNoBlur = () => {
        if (formData.psSeqNo) {
            getHeaderData();
            resetFormData();
        }
    };

    const resetFormData = () => {
        setFormData((prev) => ({
            psYear: prev.psYear,
            psSeqNo: prev.psSeqNo,
            clientname: '',
            projectname: '',
            pipesize: '',
            coating_type: '',
            testdate: '',
            shift: '',
            procedures: '',
            testOption: ''
        }));
    };

    const fetchYear = async () => {
        try {
            const response = await axios.get(Environment.BaseAPIURL + "/api/User/getprocsheetyear")
            setddlYear(response?.data);

            if (action === "edit") {
                fetchEditDetails()
            }
        }
        catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const getHeaderData = async () => {
        try {
            const response = await axios.post(`${Environment.BaseAPIURL}/api/User/getEPOXYProcessSheetDetails?testingtype=${testingtype}&year=${formData?.psYear}&processsheetno=${formData?.psSeqNo}`);
            setFormData(response?.data.Table[0]);
            setShift(response?.data.Table5[0]);
            const response1 = await axios.get(`${Environment.BaseAPIURL}/api/User/GetThicknessDate?ProcessType=526&procsheetid=${formData?.psSeqNo}`);
            const excludedDates = response1?.data[0].map(item => new Date(item.thicknessdate));
            setCoatingDates(excludedDates);

            if (response1?.data) {
                fetchTestOption();
            }
        } catch (error) {
        }
    };

    const fetchTestOption = async (id_new, seq) => {
        try {
            const response = await axios.get(Environment.BaseAPIURL + `/api/User/GetInprocessTestList?processsheetno=${formData?.psSeqNo ? formData?.psSeqNo : seq}`)
            const data = response?.data;
            const F_data = data.filter(item => item.pm_test_type === "F");
            if (action === 'edit') {
                const testItem = data.find(item => item.pm_test_type_id == id_new.toString());
                setTestOption([testItem]);
            }
            else {
                setTestOption(F_data)
            }
        }
        catch (error) {
            console.error('There was a problem fetching the data:', error);
        }
    };

    const [selectedTestId, setSelectedTestId] = useState('');

    const handleTestTypeChange = async (event) => {
        const selectedId = event.target.value;
        setSelectedTestId(selectedId);

        try {
            const response = await axios.get(Environment.BaseAPIURL + `/api/User/GetWiTestList?sub_test_id=${selectedId}&test_id=${testingtype}&mater_id=0`);
            const procedures = response?.data.map(item => ({ value: item.work_instr_id, label: item.workinst_doc_id }));
            setProcedures(procedures);
            setSelectedProcedures(procedures);
            const response2 = await axios.get(`${Environment.BaseAPIURL}/api/User/GETInstrumentDetailsByReportId?ReportId=${selectedId}`);
            setInstrumentData(response2?.data[0]);
            if (response2?.data) {
                setDisable(true);
            }
            getMFRlist(selectedId);
        } catch (error) {
            console.log('Error fetching data:', error)
        }
    }

    const formatDateToISOString = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    };

    const getMFRlist = async (testId) => {
        try {
            const response = await axios.get(`${Environment.BaseAPIURL}/api/User/GetInProcessLabTesting`, {
                params: {
                    processsheetno: formData.processsheetid,
                    testId: testId,
                    thiknessdate: coatingDate
                }
            });
            setTableData(response?.data[0]);
        } catch (error) {
            console.error('Failed', error.message);
        }
    };

    const [temperatureInput, setTemperatureInput] = useState({});
    const [sampleInput, setSampleInput] = useState({});
    const [borderColor, setBorderColor] = useState({});

    const isDateAllowed = (date) => {
        return coatingDates.some(
            allowedDate =>
                date.toDateString() === allowedDate.toDateString()
        );
    };

    const handleCoatingDateChange = (date) => {
        if (isDateAllowed(date)) {
            // const date_new = new Date(date).toISOString()
            const date_new = formatDateToISOString(date)
            setCoatingSelectedDate(date);
            setCoatingDate(date_new)
        }
    };

    const [resultInput, setResultInput] = useState({});
    const [resultInput1, setResultInput1] = useState({});
    const [resultInput2, setResultInput2] = useState({});
    const [resultMessage, setResultMessage] = useState({});

    const handleResultInputChange = (e, index, rowIndex) => {
        const { value } = e.target;

        // Generate a unique key using both index and rowIndex
        const key = `${index}-${rowIndex}`;

        // Update result input state
        setResultInput(prevState => ({
            ...prevState,
            [key]: value,
        }));

        // Update checkbox state based on input value
        setInputCheckbox(prevState => ({
            ...prevState,
            [key]: value !== '',
        }));

        // Early return if value is empty
        if (value === '') {
            setBorderColor(prevState => ({
                ...prevState,
                [key]: '',
            }));
            setResultMessage(prevState => ({
                ...prevState,
                [key]: '',
            }));
            return;
        }

        // Check if the input is alphanumeric or contains non-numeric characters (excluding decimal and negative sign)
        const isAlphanumeric = /[a-zA-Z]/.test(value);

        // If alphanumeric, always set as 'Satisfactory'
        if (isAlphanumeric) {
            setBorderColor(prevState => ({
                ...prevState,
                [key]: 'green',
            }));
            setResultMessage(prevState => ({
                ...prevState,
                [key]: 'Satisfactory',
            }));
            return;
        }

        // Parse the value as a number (it can handle decimal, negative, and positive values)
        const result = parseFloat(value);

        // Check if the parsed result is a valid number
        if (isNaN(result)) {
            // Invalid numeric input (e.g., not a valid decimal or number)
            setBorderColor(prevState => ({
                ...prevState,
                [key]: 'red',
            }));
            setResultMessage(prevState => ({
                ...prevState,
                [key]: 'Invalid Input',
            }));
            return;
        }

        // Fetch the item from tableData using the original index
        const item = tableData[index];

        // Ensure item properties are handled correctly
        const minRequirement = parseFloat(item.PM_Reqmnt_test_min);
        const maxRequirement = parseFloat(item.PM_Reqmnt_test_Max);

        // Validate the result against min and max requirements
        if ((isNaN(minRequirement) || result >= minRequirement) && (isNaN(maxRequirement) || result <= maxRequirement)) {
            setBorderColor(prevState => ({
                ...prevState,
                [key]: 'green',
            }));
            setResultMessage(prevState => ({
                ...prevState,
                [key]: 'Satisfactory',
            }));
        } else {
            setBorderColor(prevState => ({
                ...prevState,
                [key]: 'red',
            }));
            setResultMessage(prevState => ({
                ...prevState,
                [key]: 'Not Satisfactory',
            }));
        }
    };

    const handleResultInputChange1 = (e, index, rowIndex) => {
        const { value } = e.target;

        // Generate a unique key using both index and rowIndex
        const key = `${index}-${rowIndex}`;

        // Update result input state
        setResultInput1(prevState => ({
            ...prevState,
            [key]: value,
        }));

        // Update checkbox state based on input value
        setInputCheckbox(prevState => ({
            ...prevState,
            [key]: value !== '',
        }));

        // Early return if value is empty
        if (value === '') {
            setBorderColor(prevState => ({
                ...prevState,
                [key]: '',
            }));
            setResultMessage(prevState => ({
                ...prevState,
                [key]: '',
            }));
            return;
        }

        // Check if the input is alphanumeric or contains non-numeric characters (excluding decimal and negative sign)
        const isAlphanumeric = /[a-zA-Z]/.test(value);

        // If alphanumeric, always set as 'Satisfactory'
        if (isAlphanumeric) {
            setBorderColor(prevState => ({
                ...prevState,
                [key]: 'green',
            }));
            setResultMessage(prevState => ({
                ...prevState,
                [key]: 'Satisfactory',
            }));
            return;
        }

        // Parse the value as a number (it can handle decimal, negative, and positive values)
        const result = parseFloat(value);

        // Check if the parsed result is a valid number
        if (isNaN(result)) {
            // Invalid numeric input (e.g., not a valid decimal or number)
            setBorderColor(prevState => ({
                ...prevState,
                [key]: 'red',
            }));
            setResultMessage(prevState => ({
                ...prevState,
                [key]: 'Invalid Input',
            }));
            return;
        }

        // Fetch the item from tableData using the original index
        const item = tableData[index];

        // Ensure item properties are handled correctly
        const minRequirement = parseFloat(item.PM_Reqmnt_test_min);
        const maxRequirement = parseFloat(item.PM_Reqmnt_test_Max);

        // Validate the result against min and max requirements
        if ((isNaN(minRequirement) || result >= minRequirement) && (isNaN(maxRequirement) || result <= maxRequirement)) {
            setBorderColor(prevState => ({
                ...prevState,
                [key]: 'green',
            }));
            setResultMessage(prevState => ({
                ...prevState,
                [key]: 'Satisfactory',
            }));
        } else {
            setBorderColor(prevState => ({
                ...prevState,
                [key]: 'red',
            }));
            setResultMessage(prevState => ({
                ...prevState,
                [key]: 'Not Satisfactory',
            }));
        }
    };

    const handleResultInputChange2 = (e, index, rowIndex) => {
        const { value } = e.target;

        // Generate a unique key using both index and rowIndex
        const key = `${index}-${rowIndex}`;

        // Update result input state
        setResultInput2(prevState => ({
            ...prevState,
            [key]: value,
        }));

        // Update checkbox state based on input value
        setInputCheckbox(prevState => ({
            ...prevState,
            [key]: value !== '',
        }));

        // Early return if value is empty
        if (value === '') {
            setBorderColor(prevState => ({
                ...prevState,
                [key]: '',
            }));
            setResultMessage(prevState => ({
                ...prevState,
                [key]: '',
            }));
            return;
        }

        // Check if the input is alphanumeric or contains non-numeric characters (excluding decimal and negative sign)
        const isAlphanumeric = /[a-zA-Z]/.test(value);

        // If alphanumeric, always set as 'Satisfactory'
        if (isAlphanumeric) {
            setBorderColor(prevState => ({
                ...prevState,
                [key]: 'green',
            }));
            setResultMessage(prevState => ({
                ...prevState,
                [key]: 'Satisfactory',
            }));
            return;
        }

        // Parse the value as a number (it can handle decimal, negative, and positive values)
        const result = parseFloat(value);

        // Check if the parsed result is a valid number
        if (isNaN(result)) {
            // Invalid numeric input (e.g., not a valid decimal or number)
            setBorderColor(prevState => ({
                ...prevState,
                [key]: 'red',
            }));
            setResultMessage(prevState => ({
                ...prevState,
                [key]: 'Invalid Input',
            }));
            return;
        }

        // Fetch the item from tableData using the original index
        const item = tableData[index];

        // Ensure item properties are handled correctly
        const minRequirement = parseFloat(item.PM_Reqmnt_test_min);
        const maxRequirement = parseFloat(item.PM_Reqmnt_test_Max);

        // Validate the result against min and max requirements
        if ((isNaN(minRequirement) || result >= minRequirement) && (isNaN(maxRequirement) || result <= maxRequirement)) {
            setBorderColor(prevState => ({
                ...prevState,
                [key]: 'green',
            }));
            setResultMessage(prevState => ({
                ...prevState,
                [key]: 'Satisfactory',
            }));
        } else {
            setBorderColor(prevState => ({
                ...prevState,
                [key]: 'red',
            }));
            setResultMessage(prevState => ({
                ...prevState,
                [key]: 'Not Satisfactory',
            }));
        }
    };

    const [resultSuffixInput, setResultSuffixInput] = useState([]);

    const handleResultSuffixInputChange = (e, index, rowIndex) => {
        const { value } = e.target;
        const key = `${index}-${rowIndex}`; // Create a unique key

        setResultSuffixInput(prevState => ({
            ...prevState,
            [key]: value,
        }));
    };

    const handleSubmit = async (e, value) => {
        e.preventDefault();
        setIsSubmitting(true);

        const rawMaterialData = [];

        for (var x = 0; x < tableData.length; x++) {
            if (resultMessage[x] === "Not Satisfactory" && continueCode == false) {
                setModalShow(true)
                return
            }
        }

        const testsData = (selectedTestId == '987' || TestId == '987')
            ? tableData.flatMap((item, index) =>
                Array.from({ length: numRows }).map((_, rowIndex) => {
                    const key = `${index}-${rowIndex}`;
                    return {
                        ...item,
                        temperature1: temperatureInput[key] || '0',
                        test_result_accepted: resultMessage[key] === 'Satisfactory' ? "1" : "0",
                        pm_f_end: resultInput[key] || '',
                        pm_middle: resultInput1[key] || '',
                        pm_t_end: resultInput2[key] || '',
                        test_result_suffix: resultSuffixInput[key] || '',
                        pm_is_sample_cut: sampleCheckbox[key] || '0',
                        pm_sample_cut_size: sampleInput[key] || '0',
                        index
                    };
                })
            )
                // .filter(entry => entry.test_result_remarks.trim() !== '')
                .map((entry, idx) => ({
                    seqno: (idx + 1).toString(),
                    pipe_id: (entry.pm_pipe_id).toString(),
                    test_id: entry.pm_test_id.toString(),
                    pm_f_end: entry.pm_f_end.toString(),
                    pm_middle: entry.pm_middle.toString(),
                    pm_t_end: entry.pm_t_end.toString(),
                    pm_remark: entry.test_result_suffix,
                    thicknessDate: coatingDate,
                    pm_is_sample_cut: entry.pm_is_sample_cut == true ? "1" : "0",
                    pm_sample_cut_size: entry.pm_sample_cut_size,
                    result_remarks: '',
                    pm_test_result_id: entry.pm_test_result_id ? entry.pm_test_result_id : 0,
                }))
            : tableData.flatMap((item, index) =>
                Array.from({ length: numRows }).map((_, rowIndex) => {
                    const key = `${index}-${rowIndex}`;
                    return {
                        ...item,
                        temperature1: temperatureInput[key] || '0',
                        test_result_accepted: resultMessage[key] === 'Satisfactory' ? "1" : "0",
                        test_result_remarks: resultInput[key] || '',
                        test_result_suffix: resultSuffixInput[key] || '',
                        pm_is_sample_cut: sampleCheckbox[key] || '0',
                        pm_sample_cut_size: sampleInput[key] || '0',
                        index
                    };
                })
            )
                .filter(entry => entry.test_result_remarks.trim() !== '')
                .map((entry, idx) => ({
                    seqno: (idx + 1).toString(),
                    pipe_id: (entry.pm_pipe_id).toString(),
                    temperature1: (entry.temperature1).toString(),
                    test_result_accepted: entry.test_result_accepted,
                    test_result_remarks: entry.test_result_remarks,
                    test_result_suffix: entry.test_result_suffix,
                    test_datetime: entry.test_datetime ? new Date(entry.test_datetime).toLocaleString("sv-SE").split(" ").join("T") : '',
                    pm_reqmnt_temp_plus: entry.pm_reqmnt_temp_plus,
                    pm_reqmnt_temp_Minus: entry.pm_reqmnt_temp_Minus,
                    pm_reqmnt_temperature: entry.pm_reqmnt_temperature,
                    test_categ_id: entry.pm_test_categ_id.toString(),
                    test_id: entry.pm_test_id.toString(),
                    test_type_id: entry.pm_test_type_id.toString(),
                    proc_template_id: "0",
                    proc_test_id: "0",
                    pm_is_sample_cut: entry.pm_is_sample_cut == true ? "1" : "0",
                    pm_sample_cut_size: entry.pm_sample_cut_size,
                    thicknessDate: coatingDate,
                    pm_test_result_id: entry.pm_test_result_id ? entry.pm_test_result_id : 0
                }));

        const dataToSend = {
            co_comp_id: '1',
            co_location_id: '1',
            roleId: parseInt(roleId),
            project_id: formData.projectid.toString(),
            procsheet_id: formData.processsheetid.toString(),
            // testdate: (selectedTestId == '293' || selectedTestId == '986' || TestId == '293' || TestId == '986' || selectedTestId == '325') ? new Date().toLocaleString("sv-SE").split(" ").join("T") : dateTimes ? new Date(dateTimes).toLocaleString("sv-SE").split(" ").join("T") : '',
            testdate: new Date().toLocaleString("sv-SE").split(" ").join("T"),
            shift: action === 'edit' ? formData?.pm_shift_id.toString() : shift?.pm_shift_id.toString(),
            ispqt: formData.ispqt === true ? formData.ispqt.toString() : "false",
            created_by: userId.toString(),
            userid: userId.toString(),
            process_type: formData.processtypeid ? formData.processtypeid.toString() : testingtype.toString(),
            procedure_type: selectedProcedures ? selectedProcedures.map(proc => proc.value).join(',') + "," : '0',
            rm_batch: "0",
            material_id: "0",
            manufacturer_id: "0",
            grade_id: "0",
            isSubmit: value,
            testsData,
            rawMaterialData,
            test_run_id: TestRunId ? TestRunId.toString() : '0',
            instrumentData,
            subtype_id: selectedTestId.toString()
        };

        try {
            const endpoint = selectedTestId == '987' || TestId == '987' ? `SavePeelTestData` : `SaveInProcessLabFieldData`
            const response = await axios.post(`${Environment.BaseAPIURL}/api/User/${endpoint}`, dataToSend);
            toast.success('Form submitted successfully!');
            navigate(`/rawmateriallist?menuId=${menuId}&testingtype=${testingtype}`);
            setIsSubmitting(false);
            if (response.data === "1000") {
                toast.success("Form data sent successfully!");
                console.log("Form data sent successfully!");
                navigate(`/inspectiontesting?menuId=${menuId}`);
            } else {
                console.error("Failed to send form data to the server. Status code:", response.status);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Failed to submit the form.');
        }
    };

    return (
        <>
            {
                loading ? <Loading /> :
                    <>
                        <Header />
                        <section className='InnerHeaderPageSection'>
                            <div className='InnerHeaderPageBg' style={{ backgroundImage: `url(${RegisterEmployeebg})` }}></div>
                            <div className='container'>
                                <div className='row'>
                                    <div className='col-md-12 col-sm-12 col-xs-12'>
                                        <ul>
                                            <li><Link to="/dashboard?moduleId=618">Quality Module</Link></li>
                                            <b style={{ color: '#fff' }}>/ &nbsp;</b>
                                            <li> <Link to={`/inspectiontesting?menuId=${menuId}`}> {testingtypeval} List </Link> <b style={{ color: '#fff' }}></b></li>
                                            <li><h1>/&nbsp; {testingtypeval} </h1></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section className='RawmaterialPageSection'>
                            <div className='container'>
                                <div className='row'>
                                    <div className='col-md-12 col-sm-12 col-xs-12'>
                                        <div className='PipeTallySheetDetails'>
                                            <form action="" className='row m-0'>
                                                <div className='col-md-12 col-sm-12 col-xs-12'><h4>{testingtypeval} <span>- Add page</span></h4></div>
                                                <div className='col-md-4 col-sm-4 col-xs-12'>
                                                    <div className='form-group'>
                                                        <label htmlFor="">Process Sheet</label>
                                                        <div className='ProcessSheetFlexBox'>
                                                            <input
                                                                name="processSheet"
                                                                placeholder='Process sheet'
                                                                value={formData?.processsheetcode || ''}
                                                                onChange={handleInputChange}
                                                                style={{ width: '66%', cursor: 'not-allowed' }}
                                                            />
                                                            <select name="psYear" value={formData?.psYear} onChange={handleInputChange} >
                                                                <option value=""> Year </option>
                                                                {ddlYear.map((yearOption, i) => (
                                                                    <option key={i} value={yearOption.year}> {yearOption.year} </option>
                                                                ))}
                                                            </select>
                                                            <b>-</b>
                                                            <input
                                                                type="number"
                                                                name="psSeqNo"
                                                                value={formData?.psSeqNo}
                                                                onChange={handleInputChange}
                                                                placeholder='No.'
                                                                onBlur={handlePsSeqNoBlur}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                {[
                                                    { label: "Client Name", value: formData?.clientname },
                                                    { label: "Project Name", value: formData?.projectname },
                                                    { label: "Pipe Size", value: formData?.pipesize },
                                                    { label: "Type Of Coating", value: formData?.typeofcoating },
                                                    { label: "Shift", value: action === 'edit' ? formData.pm_shiftvalue : shift?.pm_shiftvalue },
                                                    { label: "Date", value: new Date(formData?.testdate).toLocaleDateString("en-GB") }
                                                ].map((field, idx) => (
                                                    <div key={idx} className="form-group col-md-4 col-sm-4 col-xs-12">
                                                        <label>{field.label}</label>
                                                        <input type="text" value={field.value} placeholder={field.label} readOnly />
                                                    </div>
                                                ))}

                                                <div className='col-md-4 col-sm-4 col-xs-12'>
                                                    <div className='form-group'>
                                                        <label>Select Coating Date</label>
                                                        <DatePicker
                                                            selected={coatingSelectedDate}
                                                            filterDate={isDateAllowed}
                                                            onChange={handleCoatingDateChange}
                                                            dateFormat="dd/MM/yyyy"
                                                            placeholderText='DD/MM/YYYY'
                                                        />
                                                    </div>
                                                </div>

                                                <div className='col-md-4 col-sm-4 col-xs-12'>
                                                    <div className='form-group'>
                                                        <label htmlFor="testType">Test Type</label>
                                                        <select id="testType" value={selectedTestId} onChange={handleTestTypeChange} >
                                                            <option selected disabled value="" >Select type</option>
                                                            {testOption.map(option => (
                                                                <option key={option.pm_test_type_id} value={option.pm_test_type_id}>{option.co_param_val_name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className='col-md-4 col-sm-4 col-xs-12'>
                                                    <div className='form-group'>
                                                        <label data-bs-toggle="modal" data-bs-target="#exampleModal1">Procedure / WI No.</label>
                                                        <Select
                                                            className='select'
                                                            value={selectedProcedures}
                                                            onChange={(selectedOption) => setSelectedProcedures(selectedOption)}
                                                            options={procedures}
                                                            isSearchable
                                                            isClearable
                                                            isMulti={true}
                                                            placeholder='Search or Select procedure...'
                                                        />
                                                    </div>
                                                </div>

                                                <div className={modalShow ? "modal fade NonSatisfactoryModal show" : "modal fade NonSatisfactoryModal"} id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: modalShow ? 'block' : 'none' }}>
                                                    <div className="modal-dialog">
                                                        <div className="modal-content">
                                                            <div className="modal-body">
                                                                <div className='NonSatisfactoryBox'>
                                                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={(e) => { e.preventDefault(); setModalShow(false); }}></button>

                                                                    <p>Are you sure you want to proceed with <br /> Non-Satisfactory result?</p>

                                                                    <div className='NonSatisfactoryModalFlex'>
                                                                        <i style={{ background: '#34B233' }} onClick={(e) => { e.preventDefault(); setContinueCode(true); setModalShow(false); handleSubmit(e, true); }} class="fas fa-thumbs-up"></i>
                                                                        <i style={{ background: '#ed2939' }} class="fas fa-thumbs-down" onClick={(e) => { e.preventDefault(); setModalShow(false); }}></i>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {disable && (
                                                    <>
                                                        <div className='col-md-12 col-sm-12 col-xs-12'>
                                                            <div className="col-md-12 col-sm-12 col-xs-12">
                                                                <hr className="DividerLine" />
                                                            </div>
                                                            <div className="col-md-12 col-sm-12 col-xs-12">
                                                                <div className="PQTBox">
                                                                    <input
                                                                        className='form-check-input'
                                                                        type="checkbox"
                                                                        id="ispqt"
                                                                        name="ispqt"
                                                                        checked={formData?.ispqt}
                                                                        onChange={(e) => setFormData((prev) => ({ ...prev, ispqt: e.target.checked }))}
                                                                    />
                                                                    <label for="pqt"> PQT</label>
                                                                </div>
                                                            </div>

                                                            <div className="accordion FrequencyaccordionSection" id="accordionExample">
                                                                <div className="accordion-item" id="headingOne">
                                                                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">Frequency: {frequency}</button>
                                                                    <div id="collapseOne" className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                                                        <div className="accordion-body">
                                                                            <div className="Frequencytable">
                                                                                <div style={{ overflow: 'auto' }} id='custom-scroll'>
                                                                                    <table>
                                                                                        <thead>
                                                                                            <tr style={{ background: "#5a245a", color: "#fff", }}>
                                                                                                <th>Sr No.</th>
                                                                                                <th>Batch</th>
                                                                                                <th>Pipe No.</th>
                                                                                                <th>Shift</th>
                                                                                                <th>Date</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody>
                                                                                            {frequencyDetails?.map((item, index) =>
                                                                                                <tr key={index}>
                                                                                                    <td>{index + 1}</td>
                                                                                                    <td>{item.batch}</td>
                                                                                                    <td>{item.pipeno}</td>
                                                                                                    <td>{item.shift}</td>
                                                                                                    <td>{new Date(item.date).toLocaleDateString("en-GB")}</td>
                                                                                                </tr>)}
                                                                                        </tbody>
                                                                                    </table>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className='col-md-12 col-sm-12 col-xs-12'><hr className='DividerLine' /></div>
                                                        <div className='row'>
                                                            <div className='col-md-3'>
                                                                <div>
                                                                    <label>Type of Coating</label>
                                                                    <select className='form-control  mb-3' required>
                                                                        <option value=''>Select Type of Coating</option>
                                                                        <option value='1'>3LPE</option>
                                                                        <option value='2'>3LPP</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='col-md-12 col-sm-12 col-xs-12'>
                                                            <div className='PipeDescriptionDetailsTable'>
                                                                <div style={{ overflow: 'auto' }} id='custom-scroll'>
                                                                    {selectedTestId == 987 || TestId == 987 ?
                                                                        <Table id='subtesttbl'>
                                                                            <thead>
                                                                                <tr style={{ background: '#5a245a', color: '#fff' }}>
                                                                                    <th style={{ minWidth: '70px' }}></th>
                                                                                    <th style={{ minWidth: '70px' }}>Sr. No.</th>
                                                                                    <th style={{ minWidth: '170px' }}>Test Description / Pipe No.</th>
                                                                                    <th style={{ minWidth: '180px' }}>Reference Standard</th>
                                                                                    <th style={{ minWidth: '200px' }}>Acceptance Criteria</th>
                                                                                    <th style={{ minWidth: '160px' }}>F-END</th>
                                                                                    <th style={{ minWidth: '160px' }}>MIDDLE</th>
                                                                                    <th style={{ minWidth: '160px' }}>T-END</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {tableData.map((item, index) => (
                                                                                    Array.from({ length: numRows }).map((_, rowIndex) => {
                                                                                        const key = `${index}-${rowIndex}`;
                                                                                        const seqno = (index * numRows + rowIndex + 1).toString();
                                                                                        return (
                                                                                            <tr key={key}>
                                                                                                <td><input type='checkbox' checked={inputCheckbox[key] || false} /></td>
                                                                                                <td>{seqno}</td>
                                                                                                <td>{item.pm_pipe_code ? item.pm_pipe_code : item.co_param_val_name}</td>
                                                                                                <td>{item.ReferenceStandard} ({item?.pm_tm_publication_yr})</td>
                                                                                                <td>{item.pm_reqmnt_suffix}</td>
                                                                                                <td>
                                                                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                                                        <input
                                                                                                            type='text'
                                                                                                            value={resultInput[key] || ''}
                                                                                                            onChange={(e) => handleResultInputChange(e, index, rowIndex)}
                                                                                                            style={{ borderColor: borderColor[key] }}
                                                                                                            placeholder='Enter result'
                                                                                                        />
                                                                                                        <div style={{ marginLeft: '5px' }}>{item?.Unit === "NA" ? "" : " " + item.Unit}</div>
                                                                                                    </div>
                                                                                                    <span>{resultMessage[key]}</span>
                                                                                                </td>
                                                                                                <td>
                                                                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                                                        <input
                                                                                                            type='text'
                                                                                                            value={resultInput1[key] || ''}
                                                                                                            onChange={(e) => handleResultInputChange1(e, index, rowIndex)}
                                                                                                            style={{ borderColor: borderColor[key] }}
                                                                                                            placeholder='Enter result'
                                                                                                        />
                                                                                                        <div style={{ marginLeft: '5px' }}>{item?.Unit === "NA" ? "" : " " + item.Unit}</div>
                                                                                                    </div>
                                                                                                    <span>{resultMessage[key]}</span>
                                                                                                </td>
                                                                                                <td>
                                                                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                                                        <input
                                                                                                            type='text'
                                                                                                            value={resultInput2[key] || ''}
                                                                                                            onChange={(e) => handleResultInputChange2(e, index, rowIndex)}
                                                                                                            style={{ borderColor: borderColor[key] }}
                                                                                                            placeholder='Enter result'
                                                                                                        />
                                                                                                        <div style={{ marginLeft: '5px' }}>{item?.Unit === "NA" ? "" : " " + item.Unit}</div>
                                                                                                    </div>
                                                                                                    <span>{resultMessage[key]}</span>
                                                                                                </td>
                                                                                            </tr>
                                                                                        );
                                                                                    })
                                                                                ))}
                                                                            </tbody>
                                                                        </Table>
                                                                        : <Table id='subtesttbl'>
                                                                            <thead>
                                                                                <tr style={{ background: '#5a245a', color: '#fff' }}>
                                                                                    <th style={{ minWidth: '70px' }}></th>
                                                                                    <th style={{ minWidth: '70px' }}>Sr. No.</th>
                                                                                    <th style={{ minWidth: '170px' }}>Test Description / Pipe No.</th>
                                                                                    <th style={{ minWidth: '180px' }}>Reference Standard</th>
                                                                                    <th style={{ minWidth: '200px' }}>Acceptance Criteria</th>
                                                                                    <th style={{ minWidth: '160px' }}>Result</th>
                                                                                    <th style={{ minWidth: '180px' }}>Result Suffix</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {tableData.map((item, index) => (
                                                                                    Array.from({ length: numRows }).map((_, rowIndex) => {
                                                                                        const key = `${index}-${rowIndex}`;
                                                                                        const seqno = (index * numRows + rowIndex + 1).toString();
                                                                                        return (
                                                                                            <tr key={key}>
                                                                                                <td><input type='checkbox' checked={inputCheckbox[key] || false} /></td>
                                                                                                <td>{seqno}</td>
                                                                                                <td>{item.pm_pipe_code ? item.pm_pipe_code : item.co_param_val_name}</td>
                                                                                                <td>{item.ReferenceStandard} ({item?.pm_tm_publication_yr})</td>
                                                                                                {/* {(selectedTestId === '297' || selectedTestId === '298' || selectedTestId === '299' || selectedTestId === '300' || selectedTestId === '301' || selectedTestId === '302')? */}
                                                                                                <td>{item.pm_reqmnt_suffix}</td>
                                                                                                {/* : <td>
                                                                                                    {item.pm_value_type === "A" ? item.pm_test_value :
                                                                                                        (item.PM_Reqmnt_test_min && item.PM_Reqmnt_test_Max) ?
                                                                                                            `${item.PM_Reqmnt_test_min} - ${item.PM_Reqmnt_test_Max}` :
                                                                                                            (item.PM_Reqmnt_test_min ? `Min - ${item.PM_Reqmnt_test_min}` :
                                                                                                                (item.PM_Reqmnt_test_Max ? `Max - ${item.PM_Reqmnt_test_Max}` : ''))
                                                                                                    }{" " + item.Unit}
                                                                                                </td>} */}
                                                                                                <td>
                                                                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                                                        {item.pm_value_type === "A" && item?.pm_test_value?.split(/,\s*/).length > 1 ? (
                                                                                                            <select value={resultInput[key] || ''} onChange={(e) => handleResultInputChange(e, index, rowIndex)}>
                                                                                                                <option>Select Value</option>
                                                                                                                {item?.pm_test_value?.split(/,\s*/)?.map((data) => (
                                                                                                                    <option key={data} value={data}>{data}</option>
                                                                                                                ))}
                                                                                                            </select>
                                                                                                        ) : (
                                                                                                            <input
                                                                                                                // type={item.pm_value_type === 'A' ? "text" : "number"}
                                                                                                                type='text'
                                                                                                                value={resultInput[key] || ''}
                                                                                                                onChange={(e) => handleResultInputChange(e, index, rowIndex)}
                                                                                                                style={{ borderColor: borderColor[key] }}
                                                                                                                placeholder='Enter result'
                                                                                                            />
                                                                                                        )}
                                                                                                        <div style={{ marginLeft: '5px' }}>{item?.Unit === "NA" ? "" : " " + item.Unit}</div>
                                                                                                    </div>
                                                                                                    <span>{resultMessage[key]}</span>
                                                                                                </td>
                                                                                                <td>
                                                                                                    <input
                                                                                                        type="text"
                                                                                                        placeholder='Enter result suffix'
                                                                                                        value={resultSuffixInput[key] || ''}
                                                                                                        onChange={(e) => handleResultSuffixInputChange(e, index, rowIndex)}
                                                                                                    />
                                                                                                </td>
                                                                                            </tr>
                                                                                        );
                                                                                    })
                                                                                ))}
                                                                            </tbody>
                                                                        </Table>}
                                                                </div>
                                                                <div className='col-md-12 col-sm-12 col-xs-12'><hr className='DividerLine' /></div>
                                                                <div className='col-md-12 col-sm-12 col-xs-12'>
                                                                    <div style={{ overflow: 'auto' }} id='custom-scroll'>
                                                                        <Table id='insttbl'>
                                                                            <thead>
                                                                                <tr style={{ background: '#5a245a', color: '#fff' }}>
                                                                                    <th colSpan={3} style={{ fontSize: '16px', textAlign: 'center' }}> Instrument to be Used</th>
                                                                                </tr>
                                                                                <tr style={{ background: '#5a245a', color: '#fff' }}>
                                                                                    <td style={{ maxWidth: '30px', background: 'whitesmoke' }}>Sr. No.</td>
                                                                                    <td style={{ maxWidth: '30px', background: 'whitesmoke' }}>Instrument Name</td>
                                                                                    <td style={{ minWidth: '30px', background: 'whitesmoke' }}>Instrument ID/Serial No.</td>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {instrumentData.map((tests, index) => (
                                                                                    <tr key={index}>
                                                                                        <td>{index + 1}</td>
                                                                                        <td>{tests.equip_name}</td>
                                                                                        <td>
                                                                                            <select name="" id="">
                                                                                                <option value="">-- Select instrument id/ serial no.--{" "}</option>
                                                                                                <option value={tests.equip_code} selected>{tests.equip_code}</option>
                                                                                            </select>
                                                                                        </td>
                                                                                    </tr>
                                                                                ))}
                                                                            </tbody>
                                                                        </Table>
                                                                    </div>
                                                                </div>

                                                                <div className='SaveButtonBox'>
                                                                    <div className='SaveButtonFlexBox'>
                                                                        <button type='button' className="DraftSaveBtn SubmitBtn" style={{ display: 'block' }} id='btnsub' onClick={(e) => handleSubmit(e, false)}>Save Draft</button>
                                                                        <button type='button' style={{ display: 'block' }} id='btnsub' onClick={(e) => handleSubmit(e, true)}>Submit</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
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

export default FieldTesting;