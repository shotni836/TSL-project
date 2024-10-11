import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import './Edittallytagmapping.css';
import InnerHeaderPageSection from "../../components/Common/Header-content/Header-content";
import Header from '../Common/Header/Header';
import Footer from '../Common/Footer/Footer';
import Loading from '../Loading';
import axios from 'axios';
import Environment from "../../environment";

function Viewtallytagmapping() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const tallySheetId = queryParams.get('tallySheetId');
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
                                        <form className='row m-0'>
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
                                                { id: 'dated', label: 'Date', value: new Date(fileData.testdate).toLocaleDateString('en-GB') },
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
                                                    { id: 'pipeRecievDate', label: 'Date', value: new Date(fileData?.pipeDetails?.[0]?.pipeRecievDate).toLocaleDateString('en-GB') },
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
                                                                            <div><input type="radio" checked={pipe.pipeStatus === 'A'} readOnly /> A</div>
                                                                            <div><input type="radio" checked={pipe.pipeStatus === 'D'} readOnly /> D</div>
                                                                            <div><input type="radio" checked={pipe.pipeStatus === 'H'} readOnly /> H</div>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </Table>
                                                        <div className='NumberrowsSubmitFlexBox'>
                                                            <p className='NumberrowsTxt'>Number of rows in the Excel file / Total Pipe Numbers: <b>{fileData.pipeDetails?.length || 0}</b></p>
                                                            <label htmlFor="totalPipeLength" style={{ margin: '0', fontSize: '14px' }}>Total Pipe Length:
                                                                <span style={{ padding: '0.5em', color: '#518ada' }} id="totalPipeLength" readOnly>
                                                                    {fileData.pipeDetails ? fileData.pipeDetails.reduce((total, pipe) => total + parseFloat(pipe.pipeLength), 0).toFixed(2) : 0}
                                                                </span>
                                                            </label>
                                                        </div>
                                                    </div>
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
// import { useLocation, useParams } from 'react-router-dom';
// import { Table } from 'react-bootstrap';
// import './Edittallytagmapping.css'
// import RegisterEmployeebg from '../../assets/images/RegisterEmployeebg.jpg'
// import Header from '../Common/Header/Header'
// import Footer from '../Common/Footer/Footer';
// import Loading from '../Loading';
// import ModalComponent from 'react-modal';
// import { Link } from 'react-router-dom';
// import 'react-datepicker/dist/react-datepicker.css';
// import Environment from "../../environment";
// import axios from 'axios';



// ModalComponent.setAppElement('#root');

// function Viewtallytagmapping() {

//     const { id } = useParams();
//     const prevPageData = useLocation()
//     const [fileData, setFileData] = useState('');
//     const [isLoading, setIsLoading] = useState(false);
//     const [headerData, setHeaderData] = useState({});
//     const [selectedDate, setSelectedDate] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [searchQuery, setSearchQuery] = useState('');

//     useEffect(() => {
//         console.log(prevPageData)
//         setIsLoading(true);
//         axios.get(`${Environment.BaseAPIURL}/api/User/GetTallyTagInfoDetails?tallySheetId=${id}`)
//             .then(response => {
//                 const data = response.data;
//                 console.log(data.clientname)
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
//                     pipeNumber: data.pipeNumber && data.pipeDetails.length > 0 ? data.pipeDetails[0].pipeNumber : '',
//                     pipeHeatNumber: data.pipeHeatNumber && data.pipeDetails.length > 0 ? data.pipeDetails[0].pipeHeatNumber : '',
//                     pipeASLNumber: data.pipeASLNumber && data.pipeDetails.length > 0 ? data.pipeDetails[0].pipeASLNumber : '',
//                     pipeRecievDate: data.pipeDetails && data.pipeDetails.length > 0 ? data.pipeDetails[0].pipeRecievDate : '',
//                     pipeLength: data.pipeLength && data.pipeDetails.length > 0 ? data.pipeDetails[0].pipeLength : '',
//                     pipeWeight: data.pipeWeight && data.pipeDetails.length > 0 ? data.pipeDetails[0].pipeWeight : '',
//                     pipeStatus: data.pipeStatus && data.pipeDetails.length > 0 ? data.pipeDetails[0].pipeStatus : '',
//                 };
//                 setHeaderData(headerData);
//                 setSelectedDate(headerData.pipeRecievDate.split(' ')[0]);
//                 setIsLoading(false);
//                 console.log(headerData, "headerData")
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
//                                             <li><Link to='/ppcdashboard'>PPC Module</Link></li>
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
//                                                     <h5>Tally Tag Mapping <span>- View page</span></h5>
//                                                 </div>
//                                                 <div className='col-md-4 col-sm-4 col-xs-12'>
//                                                     <div className='form-group'>
//                                                         <label htmlFor="processSheet">Process Sheet</label>
//                                                         <div className='ProcessSheetFlexBox'>
//                                                             <input id="processSheet" style={{ width: '66%', cursor: 'not-allowed' }} value={fileData?.processsheetid} placeholder='Process sheet no.' readOnly />
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
//                                                         <input id="projectName" type="text" value={fileData?.projectname} placeholder='Project name' style={{ cursor: 'not-allowed' }} readOnly />
//                                                     </div>
//                                                 </div>
//                                                 <div className='col-md-4 col-sm-4 col-xs-12'>
//                                                     <div className='form-group'>
//                                                         <label htmlFor="pipeSize">Pipe Size</label>
//                                                         <input id="pipeSize" type="text" value={fileData?.pipesize} placeholder='Pipe size' style={{ cursor: 'not-allowed' }} readOnly />
//                                                     </div>
//                                                 </div>
//                                                 <div className='col-md-4 col-sm-4 col-xs-12'>
//                                                     <div className='form-group'>
//                                                         <label htmlFor="specification">Specification</label>
//                                                         <input id="specification" type="text" value={fileData?.specgrade} placeholder='Specification' style={{ cursor: 'not-allowed' }} readOnly />
//                                                     </div>
//                                                 </div>
//                                                 <div className='col-md-4 col-sm-4 col-xs-12'>
//                                                     <div className='form-group'>
//                                                         <label htmlFor="poNo">PO.NO/LOA.NO</label>
//                                                         <input id="poNo" type="text" value={fileData?.poNo} placeholder='PO.NO/LOA.NO' style={{ cursor: 'not-allowed' }} readOnly />
//                                                     </div>
//                                                 </div>
//                                                 <div className='col-md-4 col-sm-4 col-xs-12'>
//                                                     <div className='form-group'>
//                                                         <label htmlFor="dated">Dated</label>
//                                                         <input id="dated" type="text" value={fileData?.testdate.split(" ")[0]} placeholder='DD/MMM/YYYY' style={{ cursor: 'not-allowed' }} readOnly />
//                                                     </div>
//                                                 </div>
//                                                 <div className='col-md-4 col-sm-4 col-xs-12'>
//                                                     <div className='form-group'>
//                                                         <label htmlFor="shift">Shift</label>
//                                                         <input id="shift" type="text" value={fileData?.pm_shiftvalue} placeholder='Shift' style={{ cursor: 'not-allowed' }} readOnly />
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
//                                                             <input id="dated" type="text" value={selectedDate} placeholder='DD/MM/YYYY' readOnly />
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                                 <div className='col-md-12 col-sm-12 col-xs-12'>
//                                                     <div className="DragDropUploadDivBox">
//                                                         {isLoading && <p className="loading">Loading...</p>}
//                                                         <div className='Tallytagmappingtable'>
//                                                             <div className='NumberrowsSubmitFlexBox'>
//                                                                 <p className='NumberrowsTxt'>Number of rows in the Excel file / Total Pipe Numbers: <b>{fileData.pipeDetails ? fileData.pipeDetails.length : 0}</b></p>
//                                                                 <label htmlFor="totalPipeLength" style={{ margin: '0', fontSize: '14px' }}>Total Pipe Length(MTR.):
//                                                                     <span style={{ padding: '0.5em', color: '#518ada' }} id="totalPipeLength" readOnly>
//                                                                         {fileData.pipeDetails ? fileData.pipeDetails.reduce((total, pipe) => total + parseFloat(pipe.pipeLength), 0).toFixed(2) : 0}
//                                                                     </span>
//                                                                 </label>
//                                                             </div>

//                                                             <div className='SearchBox'>
//                                                                 <input
//                                                                     style={{ width: "250px" }}
//                                                                     type="text"
//                                                                     placeholder="Search by ASL number or Pipe number"
//                                                                     value={searchQuery}
//                                                                     onChange={(e) => setSearchQuery(e.target.value)}
//                                                                 />
//                                                             </div>

//                                                             <Table striped bordered className='tallytagmappingExcelfileTable'>
//                                                                 <thead>
//                                                                     <tr style={{ background: 'rgb(90, 36, 90)', color: '#fff' }}>
//                                                                         <th style={{ width: '50px' }}>S. No.</th>
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
//                                                                                             checked={!pipe.pipeStatus || pipe.pipeStatus === 'A'}
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
//                                                             <div className='NumberrowsSubmitFlexBox'>
//                                                                 <p className='NumberrowsTxt'>Number of rows in the Excel file / Total Pipe Numbers: <b>{fileData.pipeDetails ? fileData.pipeDetails.length : 0}</b></p>
//                                                                 <label htmlFor="totalPipeLength" style={{ margin: '0', fontSize: '14px' }}>Total Pipe Length:
//                                                                     <span style={{ padding: '0.5em', color: '#518ada' }} id="totalPipeLength" readOnly>
//                                                                         {fileData.pipeDetails ? fileData.pipeDetails.reduce((total, pipe) => total + parseFloat(pipe.pipeLength), 0).toFixed(2) : 0}
//                                                                     </span>
//                                                                 </label>
//                                                                 <div></div>
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

// export default Viewtallytagmapping;