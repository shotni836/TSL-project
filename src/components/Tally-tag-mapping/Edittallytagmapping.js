import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import './Edittallytagmapping.css';
import InnerHeaderPageSection from "../../components/Common/Header-content/Header-content";
import Header from '../Common/Header/Header';
import Footer from '../Common/Footer/Footer';
import Loading from '../Loading';
import axios from 'axios';
import Environment from "../../environment";
import { toast } from 'react-toastify';

function Viewtallytagmapping() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const tallySheetId = queryParams.get('tallySheetId');
    const navigate = useNavigate();
    const [fileData, setFileData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        axios.get(`${Environment.BaseAPIURL}/api/User/GetTallyTagInfoDetails?tallySheetId=${tallySheetId}`)
            .then(response => {
                setFileData(response.data || []);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setIsLoading(false);
            });
    }, [tallySheetId]);

    const handleStatusChange = (index, newStatus) => {
        setFileData(prevData => {
            const updatedPipeDetails = [...prevData.pipeDetails];
            updatedPipeDetails[index].pipeStatus = newStatus;
            return { ...prevData, pipeDetails: updatedPipeDetails };
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const dataToSend = fileData.pipeDetails?.map(pipe => ({
            pipeId: pipe.pipeNo,
            tallySheetId: parseInt(tallySheetId),
            pipe_Status: pipe.pipeStatus,
        }));

        axios.post(`${Environment.BaseAPIURL}/api/User/UpdatePipeStatus`, dataToSend)
            .then(response => {
                console.log('Data submitted successfully:', response);
                toast.success(response.data.responseMessage);
                navigate('/tallytagmappinglist?menuId=5');
            })
            .catch(error => {
                console.error('Error submitting data:', error);
                toast.error('Failed to update');
            });
    };

    const filteredPipeDetails = fileData.pipeDetails?.filter(pipe =>
        pipe.pipeASLNumber.includes(searchQuery) || pipe.pipeNumber.includes(searchQuery)
    );

    return (
        <>
            {isLoading ? <Loading /> :
                <>
                    <Header />
                    <InnerHeaderPageSection
                        linkTo="/ppcdashboard?moduleId=617"
                        linkText="PPC Module"
                        linkText2="Tally Tag Mapping"
                    />
                    <section className='TallytagmappingPageSection'>
                        <div className='container'>
                            <div className='row'>
                                <div className='col-md-12'>
                                    <div className='PipeTallySheetDetails'>
                                        <form className='row m-0' onSubmit={handleSubmit}>
                                            <div className='col-md-12'>
                                                <h5>Tally Tag Mapping <span>- View page</span></h5>
                                            </div>
                                            {[
                                                { id: 'processSheet', label: 'Process Sheet', value: fileData?.processsheetcode },
                                                { id: 'clientName', label: 'Client Name', value: fileData.clientname },
                                                { id: 'projectName', label: 'Project Name', value: fileData.projectname },
                                                { id: 'pipeSize', label: 'Pipe Size', value: fileData.pipesize },
                                                { id: 'specification', label: 'Specification', value: fileData.specification },
                                                { id: 'poNo', label: 'PO.NO/LOA.NO', value: fileData.poNo },
                                                { id: 'dated', label: 'Date', value: new Date(fileData.testdate).toLocaleDateString('en-GB').replace(/\//g, "-") },
                                                { id: 'shift', label: 'Shift', value: fileData.pm_shiftvalue },
                                            ].map(field => (
                                                <div key={field.id} className='col-md-4'>
                                                    <div className='form-group'>
                                                        <label htmlFor={field.id}>{field.label}</label>
                                                        <input
                                                            id={field.id}
                                                            value={field.value}
                                                            readOnly
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="row m-0">
                                                {[
                                                    { id: 'soNumber', label: 'Sr No.', value: fileData?.soNumber },
                                                    { id: 'tallySheetNo', label: 'Tally Sheet No.', value: fileData?.tallySheetNo },
                                                    { id: 'mtcNo', label: 'MTC No.', value: fileData?.mtcNo },
                                                    { id: 'pipeRecievDate', label: 'Date', value: new Date(fileData?.pipeDetails?.[0]?.pipeRecievDate).toLocaleDateString('en-GB').replace(/\//g, "-") },
                                                ].map(field => (
                                                    <div key={field.id} className='col-md-3'>
                                                        <div className='form-group'>
                                                            <label htmlFor={field.id}>{field.label}</label>
                                                            <input
                                                                id={field.id}
                                                                value={field.value}
                                                                readOnly
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className='col-md-12'>
                                                <div className="DragDropUploadDivBox">
                                                    <div className='Tallytagmappingtable'>
                                                        <div className='NumberrowsSubmitFlexBox'>
                                                            <p className='NumberrowsTxt'>Number of rows in the Excel file / Total Pipe Numbers: <b>{fileData.pipeDetails?.length || 0}</b></p>
                                                            <label htmlFor="totalPipeLength" style={{ margin: '0', fontSize: '14px' }}>Total Pipe Length(MTR.):
                                                                <span style={{ padding: '0.5em', color: '#518ada' }} id="totalPipeLength" readOnly>
                                                                    {fileData.pipeDetails ? fileData.pipeDetails.reduce((total, pipe) => total + parseFloat(pipe.pipeLength), 0).toFixed(2) : 0}
                                                                </span>
                                                            </label>
                                                        </div>

                                                        <div className='SearchBox'>
                                                            <input
                                                                style={{ width: "250px" }}
                                                                type="text"
                                                                placeholder="Search by ASL number or Pipe number"
                                                                value={searchQuery}
                                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                            />
                                                        </div>
                                                        <ul className="fadedIcon tally-tag-legends" style={{ display: 'flex', justifyContent: 'end' }}>
                                                            <li style={{ color: '#6bcf5f' }}><span style={{ border: '1px solid', borderRadius: '50%', padding: '0 3px', marginRight: '2px', fontSize: '10px' }}>A</span>Active</li>
                                                            <li style={{ color: '#ff5252' }}><span style={{ margin: '0 10px', border: '1px solid', borderRadius: '50%', padding: '0 3px', marginRight: '2px', fontSize: '10px' }}>D</span>Deactive</li>
                                                            <li style={{ color: '#ff9800' }}><span style={{ margin: '0 10px', border: '1px solid', borderRadius: '50%', padding: '0 3px', marginRight: '2px', fontSize: '10px' }}>H</span>Hold</li>
                                                        </ul>

                                                        <Table striped bordered className='tallytagmappingExcelfileTable'>
                                                            <thead>
                                                                <tr style={{ background: 'rgb(90, 36, 90)', color: '#fff' }}>
                                                                    <th style={{ width: '50px' }}>S. No.</th>
                                                                    <th style={{ width: '50px' }}>PIPE No.</th>
                                                                    <th style={{ width: '100px' }}>HEAT No.</th>
                                                                    <th style={{ width: '100px' }}>LENGTH (MTR.)</th>
                                                                    <th style={{ width: '100px' }}>WEIGHT (MT.)</th>
                                                                    <th style={{ width: '100px' }}>REMARKS (ASL No.)</th>
                                                                    <th style={{ width: '100px' }}>STATUS</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {filteredPipeDetails?.map((pipe, index) => (
                                                                    <tr key={index}>
                                                                        <td>{index + 1}</td>
                                                                        <td>{pipe.pipeNumber}</td>
                                                                        <td>{pipe.pipeHeatNumber}</td>
                                                                        <td>{pipe.pipeLength}</td>
                                                                        <td>{pipe.pipeWeight}</td>
                                                                        <td>{pipe.pipeASLNumber}</td>
                                                                        <td className='action-radio-buttons'>
                                                                            <div>
                                                                                <input type="radio" checked={pipe.pipeStatus === 'A'}
                                                                                    onChange={() => handleStatusChange(index, 'A')} title='Active'
                                                                                /> A
                                                                            </div>
                                                                            <div>
                                                                                <input type="radio" checked={pipe.pipeStatus === 'D'}
                                                                                    onChange={() => handleStatusChange(index, 'D')} title='De-active'
                                                                                /> D
                                                                            </div>
                                                                            <div>
                                                                                <input type="radio" checked={pipe.pipeStatus === 'H'}
                                                                                    onChange={() => handleStatusChange(index, 'H')} title='Hold'
                                                                                /> H
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </Table>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='NumberrowsSubmitFlexBox'>
                                                <p className='NumberrowsTxt'>Number of rows in the Excel file / Total Pipe Numbers: <b>{fileData.pipeDetails?.length || 0}</b></p>
                                                <label htmlFor="totalPipeLength" style={{ margin: '0', fontSize: '14px' }}>Total Pipe Length:
                                                    <span style={{ padding: '0.5em', color: '#518ada' }} id="totalPipeLength" readOnly>
                                                        {fileData.pipeDetails ? fileData.pipeDetails.reduce((total, pipe) => total + parseFloat(pipe.pipeLength), 0).toFixed(2) : 0}
                                                    </span>
                                                </label>
                                                <div className='col-md-12 col-sm-12 col-xs-12' style={{ textAlign: 'right' }}>
                                                    <button type='submit' className='btn btn-primary'>Update</button>
                                                </div>
                                            </div>
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
    );
}

export default Viewtallytagmapping;

// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { Table } from 'react-bootstrap';
// import './Edittallytagmapping.css'
// import RegisterEmployeebg from '../../assets/images/RegisterEmployeebg.jpg'
// import Header from '../Common/Header/Header'
// import Footer from '../Common/Footer/Footer';
// import Loading from '../Loading';
// import { Link } from 'react-router-dom';
// import 'react-datepicker/dist/react-datepicker.css';
// import Environment from "../../environment";
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// function Edittallytagmapping() {

//     const { id } = useParams();
//     const [isModalOpen, setIsModalOpen] = useState(true);
//     const [fileData, setFileData] = useState([]);
//     const [isLoading, setIsLoading] = useState(false);
//     const [headerData, setHeaderData] = useState({});
//     const [selectedDate, setSelectedDate] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate();
//     const [totalPipeLength, setTotalPipeLength] = useState();
//     const [rowCount, setRowCount] = useState(0);
//     const [searchQuery, setSearchQuery] = useState('');

//     useEffect(() => {
//         setIsLoading(true);
//         fetch(`${Environment.BaseAPIURL}/api/User/GetTallyTagInfoDetails?tallySheetId=${id}`)
//             .then(response => response.json())
//             .then(data => {
//                 setFileData(data);
//                 const headerData = {
//                     clientname: data.clientname,
//                     projectname: data.projectname,
//                     pipesize: data.pipesize,
//                     specgrade: data.specgrade,
//                     PONo: data.PONo,
//                     shift: data.shift,
//                     soNumber: data.soNumber,
//                     tallySheetNo: data.tallySheetNo,
//                     mtcNo: data.mtcNo,
//                     pipeDetails: data.pipeDetails,
//                     pipeNumber: data.pipeNumber,
//                     pipeHeatNumber: data.pipeHeatNumber,
//                     pipeASLNumber: data.pipeASLNumber,
//                     pipeRecievDate: data.pipeDetails && data.pipeDetails.length > 0 ? data.pipeDetails[0].pipeRecievDate : '',
//                     pipeLength: data.pipeLength,
//                     pipeWeight: data.pipeWeight,
//                     pipeStatus: data.pipeStatus,
//                 };
//                 setHeaderData(headerData);
//                 setSelectedDate(headerData.pipeRecievDate.split(' ')[0]);
//                 setIsLoading(false);
//                 setRowCount(data.pipeDetails ? data.pipeDetails.length : 0);
//                 const totalLength = data.pipeDetails.reduce((total, pipe) => total + parseFloat(pipe.pipeLength), 0);
//                 setTotalPipeLength(totalLength);
//             })
//             .catch(error => {
//                 console.error('Error fetching data:', error);
//                 setIsLoading(false);
//             });
//     }, [id]);

//     const handleStatusChange = (index, value) => {
//         const updatedPipeDetails = [...fileData.pipeDetails]; // Copy the pipe details array
//         updatedPipeDetails[index] = {
//             ...updatedPipeDetails[index],
//             pipeStatus: value,
//         };
//         setFileData({
//             ...fileData,
//             pipeDetails: updatedPipeDetails, // Update the pipe details array in fileData
//         });
//     };

//     const updatePipeStatus = () => {
//         // Create an array to store promises for each pipe detail update
//         const promises = [];

//         // Iterate over each pipe detail
//         fileData.pipeDetails.forEach(pipe => {
//             const { pipeId, pipe_Status } = pipe;

//             // Prepare data to send in the request body
//             const requestData = {
//                 pipeId: 11,
//                 tallySheetId: parseInt(id),
//                 pipe_Status: pipe.pipe_Status
//             };

//             // Push the promise for this pipe detail update to the promises array
//             promises.push(
//                 axios.post(`${Environment.BaseAPIURL}/api/User/UpdatePipeStatus`, requestData)
//                     .then(response => {
//                         console.log('Pipe status updated successfully:', response.data);
//                         // Add any additional logic after updating pipe status
//                     })
//                     .catch(error => {
//                         console.error('Error updating pipe status:', error);
//                     })
//             );
//         });


//         Promise.all(promises)
//             .then(() => {
//                 console.log('All pipe statuses updated successfully');
//                 // Add any additional logic after updating all pipe statuses
//             })
//             .catch(error => {
//                 console.error('Error updating pipe statuses:', error);
//             });
//     };

//     const closeModal = (event) => {
//         event.preventDefault();
//         setIsModalOpen(false);
//         navigate('/Tallytagmappinglist');
//         window.location.reload();
//     };

//     // Filter pipe details based on search query
//     const filteredPipeDetails = fileData.pipeDetails && fileData.pipeDetails.filter(pipe =>
//         pipe.pipeASLNumber.includes(searchQuery) || pipe.pipeNumber.includes(searchQuery)
//     );

//     return (
//         <>
//             {
//                 loading ? <Loading /> :
//                     <>
//                         <Header />
//                         <section className='InnerHeaderPageSection'>
//                             <div className='InnerHeaderPageBg' style={{ backgroundImage: `url(${RegisterEmployeebg})` }}></div>
//                             <div className='container'>
//                                 <div className='row'>
//                                     <div className='col-md-12 col-sm-12 col-xs-12'>
//                                         <ul>
//                                             <li> <Link to='/ppcdashboard'>PPC Module</Link></li>
//                                             <li><h1> / &nbsp;Tally Tag Mapping </h1></li>
//                                         </ul>
//                                     </div>
//                                 </div>
//                             </div>
//                         </section>
//                         <section className='TallytagmappingPageSection'>
//                             <div className='container'>
//                                 <div className='row'>
//                                     <div className='col-md-12 col-sm-12 col-sm-12'>
//                                         <div className='PipeTallySheetDetails'>
//                                             <form action="" className='row m-0'>
//                                                 <div className='col-md-12 col-sm-12 col-xs-12'>
//                                                     <h5>Tally Tag Mapping <span>- Edit page</span></h5>
//                                                 </div>
//                                                 <div className='col-md-4 col-sm-4 col-xs-12'>
//                                                     <div className='form-group'>
//                                                         <label htmlFor="processSheet">Process Sheet</label>
//                                                         <div className='ProcessSheetFlexBox'>
//                                                             <input id="processSheet" style={{ width: '66%', cursor: 'not-allowed' }} value={fileData?.processsheetcode} placeholder='Process sheet no.' readOnly />

//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                                 <div className='col-md-4 col-sm-4 col-xs-12'>
//                                                     <div className='form-group'>
//                                                         <label htmlFor="clientName">Client Name</label>
//                                                         <input id="clientName" type="text" value={fileData?.clientname} placeholder='Client name' style={{ cursor: 'not-allowed' }} readOnly />
//                                                     </div>
//                                                 </div>
//                                                 <div className='col-md-4 col-sm-4 col-xs-12'>
//                                                     <div className='form-group'>
//                                                         <label htmlFor="projectName">Project Name</label>
//                                                         <input id="projectName" type="text" value={headerData.projectname} placeholder='Project name' style={{ cursor: 'not-allowed' }} readOnly />
//                                                     </div>
//                                                 </div>
//                                                 <div className='col-md-4 col-sm-4 col-xs-12'>
//                                                     <div className='form-group'>
//                                                         <label htmlFor="pipeSize">Pipe Size</label>
//                                                         <input id="pipeSize" type="text" value={headerData.pipesize} placeholder='Pipe size' style={{ cursor: 'not-allowed' }} readOnly />
//                                                     </div>
//                                                 </div>
//                                                 <div className='col-md-4 col-sm-4 col-xs-12'>
//                                                     <div className='form-group'>
//                                                         <label htmlFor="specification">Specification</label>
//                                                         <input id="specification" type="text" value={headerData.specgrade} placeholder='Specification' style={{ cursor: 'not-allowed' }} readOnly />
//                                                     </div>
//                                                 </div>
//                                                 <div className='col-md-4 col-sm-4 col-xs-12'>
//                                                     <div className='form-group'>
//                                                         <label htmlFor="poNo">PO.NO/LOA.NO</label>
//                                                         <input id="poNo" type="text" value={headerData.PONo} placeholder='PO.NO/LOA.NO' style={{ cursor: 'not-allowed' }} readOnly />
//                                                     </div>
//                                                 </div>
//                                                 <div className='col-md-4 col-sm-4 col-xs-12'>
//                                                     <div className='form-group'>
//                                                         <label htmlFor="dated">Dated</label>
//                                                         <input id="dated" type="text" value={''} placeholder='DD/MMM/YYYY' style={{ cursor: 'not-allowed' }} readOnly />
//                                                     </div>
//                                                 </div>
//                                                 <div className='col-md-4 col-sm-4 col-xs-12'>
//                                                     <div className='form-group'>
//                                                         <label htmlFor="shift">Shift</label>
//                                                         <input id="shift" type="text" value={headerData.shift} placeholder='Shift' style={{ cursor: 'not-allowed' }} readOnly />
//                                                     </div>
//                                                 </div>

//                                                 <div className="row m-0">
//                                                     <div className='col-md-3 col-sm-3 col-xs-12'>
//                                                         <div className='form-group'>
//                                                             <label htmlFor="sNo">S. No.</label>
//                                                             <input id="sNo" type="text" value={headerData.soNumber} placeholder='Enter S. No.' />
//                                                         </div>
//                                                     </div>
//                                                     <div className='col-md-3 col-sm-3 col-xs-12'>
//                                                         <div className='form-group'>
//                                                             <label htmlFor="tallySheetNo">Tally Sheet No.</label>
//                                                             <input id="tallySheetNo" type="text" value={headerData.tallySheetNo} placeholder='Enter tally sheet no.' />
//                                                         </div>
//                                                     </div>
//                                                     <div className='col-md-3 col-sm-3 col-xs-12'>
//                                                         <div className='form-group'>
//                                                             <label htmlFor="mtcNo">MTC No.</label>
//                                                             <input id="mtcNo" type="text" value={headerData.mtcNo} placeholder='Enter MTC No.' />
//                                                         </div>
//                                                     </div>
//                                                     <div className='col-md-3 col-sm-3 col-xs-12'>
//                                                         <div className='form-group'>
//                                                             <label htmlFor="date">Date</label>
//                                                             <input id="dated" type="text" value={selectedDate} placeholder='DD/MMM/YYYY' readOnly />
//                                                         </div>
//                                                     </div>
//                                                 </div>

//                                                 <div className='col-md-12 col-sm-12 col-xs-12'>

//                                                     <div className="DragDropUploadDivBox">
//                                                         {isLoading && <p className="loading">Loading...</p>}

//                                                         <div className='Tallytagmappingtable'>
//                                                             <div className='NumberrowsSubmitFlexBox'>

//                                                                 <p className='NumberrowsTxt'>Number of rows in the Excel file / Total Pipe Numbers: <b>{fileData.pipeDetails ? fileData.pipeDetails.length : 0}</b></p>
//                                                                 <label htmlFor="totalPipeLength" style={{ margin: '0', fontSize: '14px' }}>Total Pipe Length:
//                                                                     <span style={{ padding: '0.5em', color: '#518ada' }} id="totalPipeLength" readOnly>
//                                                                         {fileData.pipeDetails ? fileData.pipeDetails.reduce((total, pipe) => total + parseFloat(pipe.pipeLength), 0).toFixed(2) : 0}
//                                                                     </span>
//                                                                 </label>

//                                                                 <div className="modal fade checkModalBox" id="checkModal" tabIndex="-1" aria-labelledby="checkModalLabel" aria-hidden="true">
//                                                                     <div className="modal-dialog">
//                                                                         <div className="modal-content">
//                                                                             <div className='checkIconBox'>
//                                                                             </div>
//                                                                         </div>
//                                                                     </div>
//                                                                 </div>

//                                                                 <div className="modal fade checkModalBox" id="checkModal" tabIndex="-1" aria-labelledby="checkModalLabel" aria-hidden="true">
//                                                                     <div className="modal-dialog">
//                                                                         <div className="modal-content">
//                                                                             <div className='checkIconBox'>
//                                                                             </div>
//                                                                         </div>
//                                                                     </div>
//                                                                 </div>

//                                                                 <div className='DownloadButton'>
//                                                                     <button type='button' data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={updatePipeStatus} style={{
//                                                                         backgroundColor: '#1353ad',
//                                                                         cursor: 'pointer',
//                                                                     }}>Update</button>
//                                                                 </div>
//                                                             </div>

//                                                             <div className="modal fade successfulModalBox" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
//                                                                 <div className="modal-dialog">
//                                                                     <div className="modal-content">
//                                                                         <div className='successfuliconBox'>
//                                                                             <i className="fas fa-check-circle"></i>
//                                                                         </div>
//                                                                         <div className="modal-body">
//                                                                             <h4>Great!</h4>
//                                                                             <p>
//                                                                                 Tally Sheet No. <b>{id}</b>
//                                                                                 is updated <br />
//                                                                             </p>
//                                                                             <Link to='/Tallytagmappinglist' onClick={closeModal} className="btn btn-danger">OK</Link>

//                                                                         </div>
//                                                                     </div>
//                                                                 </div>
//                                                             </div>

//                                                             <div className='SearchBox'>
//                                                                 <input
//                                                                     type="text"
//                                                                     style={{ minWidth: '250px' }}
//                                                                     placeholder="Search by ASL number or Pipe number"
//                                                                     value={searchQuery}
//                                                                     onChange={(e) => setSearchQuery(e.target.value)}
//                                                                 />
//                                                             </div>
//                                                             <Table striped bordered className='tallytagmappingExcelfileTable'>
//                                                                 <thead>
//                                                                     <tr style={{ background: 'rgb(90, 36, 90)', color: '#fff' }}>
//                                                                         <th style={{ width: '10px' }}>S. No.</th>
//                                                                         <th style={{ width: '50px' }}>PIPE No.</th>
//                                                                         <th style={{ width: '100px' }}>HEAT No.</th>
//                                                                         <th style={{ width: '100px' }}>LENGTH (MTR.)</th>
//                                                                         <th style={{ width: '100px' }}>WEIGHT (MT.)</th>
//                                                                         <th style={{ width: '100px' }}>REMARKS (ASL No.)</th>
//                                                                         <th style={{ width: '100px' }}>STATUS</th>
//                                                                     </tr>
//                                                                 </thead>
//                                                                 {fileData && fileData.pipeDetails ? (
//                                                                     <tbody>
//                                                                         {filteredPipeDetails && filteredPipeDetails.map((pipe, index) => (
//                                                                             <tr key={index}>
//                                                                                 <td>{index + 1}</td>
//                                                                                 <td>{pipe.pipeNumber}</td>
//                                                                                 <td>{pipe.pipeHeatNumber}</td>
//                                                                                 <td>{pipe.pipeLength}</td>
//                                                                                 <td>{pipe.pipeWeight}</td>
//                                                                                 <td>{pipe.pipeASLNumber}</td>
//                                                                                 <td className='action-radio-buttons'>
//                                                                                     <div>
//                                                                                         <input
//                                                                                             type="radio"
//                                                                                             name={`status-${index}`}
//                                                                                             value="A"
//                                                                                             checked={pipe.pipeStatus === 'A'}
//                                                                                             onChange={() => handleStatusChange(index, 'A')}
//                                                                                         />
//                                                                                         A
//                                                                                     </div>
//                                                                                     <div>
//                                                                                         <input
//                                                                                             type="radio"
//                                                                                             name={`status-${index}`}
//                                                                                             value="D"
//                                                                                             checked={pipe.pipeStatus === 'D'}
//                                                                                             onChange={() => handleStatusChange(index, 'D')}
//                                                                                         />
//                                                                                         D
//                                                                                     </div>
//                                                                                     <div>
//                                                                                         <input
//                                                                                             type="radio"
//                                                                                             name={`status-${index}`}
//                                                                                             value="H"
//                                                                                             checked={pipe.pipeStatus === 'H'}
//                                                                                             onChange={() => handleStatusChange(index, 'H')}
//                                                                                         />
//                                                                                         H
//                                                                                     </div>
//                                                                                 </td>
//                                                                             </tr>
//                                                                         ))}
//                                                                     </tbody>

//                                                                 ) : null}

//                                                             </Table>

//                                                             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//                                                                 <div className='form-group' style={{ margin: '0' }}>
//                                                                 </div>

//                                                                 <div className='NumberrowsSubmitFlexBox' style={{ border: 'none', margin: '10', padding: '0' }}>

//                                                                     <p className='NumberrowsTxt'>Number of rows in the Excel file / Total Pipe Numbers: <b>{fileData.pipeDetails ? fileData.pipeDetails.length : 0}</b></p>
//                                                                     <label htmlFor="totalPipeLength" style={{ margin: '0', fontSize: '14px' }}>Total Pipe Length(MTR.):
//                                                                         <span style={{ padding: '0.5em', color: '#518ada' }} id="totalPipeLength" readOnly>
//                                                                             {fileData.pipeDetails ? fileData.pipeDetails.reduce((total, pipe) => total + parseFloat(pipe.pipeLength), 0).toFixed(2) : 0}
//                                                                         </span>
//                                                                     </label>

//                                                                     <button type='button' data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={updatePipeStatus} style={{
//                                                                         backgroundColor: '#1353ad',
//                                                                         cursor: 'pointer',
//                                                                     }}>Update</button>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </form>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </section>
//                         <Footer />

//                     </>
//             }
//         </>
//     )
// }

// export default Edittallytagmapping;
