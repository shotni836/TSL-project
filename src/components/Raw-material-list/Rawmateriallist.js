import React, { useState, useEffect, useCallback } from 'react';
import './Rawmateriallist.css'
import Header from '../Common/Header/Header'
import Footer from '../Common/Footer/Footer'
import Loading from '../Loading';
import RegisterEmployeebg from '../../assets/images/RegisterEmployeebg.jpg';
import Pagination from '../Common/Pagination/Pagination';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Environment from "../../environment";
import secureLocalStorage from 'react-secure-storage';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTrash, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';

function Rawmateriallist() {

  const navigate = useNavigate()
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId = secureLocalStorage.getItem("userId");
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState({});
  const [data, setData] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [options, setOptions] = useState([]);
  const [selectedTest, setSelectedTest] = useState();
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchPermissions = async () => {
    try {
      const response = await axios.get(`${Environment.BaseAPIURL}/api/User/GetPermissionDetailsByPageId`, {
        params: { UserId: userId, PageId: menuId }
      });
      setPermissions(response.data[0]);
    } catch (error) {
      console.error('Error fetching permissions:', error);
    }
  }

  const searchParams = new URLSearchParams(document.location.search);
  const menuId = queryParams.get('menuId');
  let testingtype = searchParams.get('testingtype');
  let testingtypeval = "";
  let addscreenurl = "";
  let endpoint = "";

  if (testingtype === "605") {
    testingtypeval = "Raw Material Inhouse";
    endpoint = 'inhousetest';
  }
  if (testingtype === "607") {
    testingtypeval = "Before Process Lab Testing";
    endpoint = 'beforeprocesslabtest';
  }
  if (testingtype === "608") {
    testingtypeval = "In Process Lab Testing";
    endpoint = 'labtest';
  }
  if (testingtype === "609") {
    testingtypeval = "In Process Field Testing";
    endpoint = 'fieldtest';
  }
  addscreenurl = `/${endpoint}?menuId=${menuId}&testingtype=${testingtype}`;

  const getProcessUrl = (action, row) => {
    return testingtype === '607' ? `/before-process-lab-test/${row.procsheet_id}&${row.pm_test_run_id}&${testingtype}&${row.pm_process_subtype_id}&pm_Approve_level=${action}&pm_project_id=${row.project_id}&pm_processSheet_id=${row.procsheet_id}&pm_processtype_id=${row.co_param_val_id}&pm_approved_by=${userId}&test_date=${row.test_date}&menuId=${menuId}`
      : testingtype !== '607' && testingtype !== '609' && row.process_type_sub.includes("CD")
        ? `/cd-test/${row.procsheet_id}&${row.pm_test_run_id}&${testingtype}&${row.pm_test_id}&pm_Approve_level=${action}&pm_project_id=${row.project_id}&pm_processSheet_id=${row.procsheet_id}&pm_processtype_id=${row.co_param_val_id}&pm_approved_by=${userId}&test_date=${row.test_date}&menuId=${menuId}`
        : testingtype === '605' ? `/in-house-test/${row.procsheet_id}&${row.pm_test_run_id}&${testingtype}&${row.pm_process_subtype_id}&pm_Approve_level=${action}&pm_project_id=${row.project_id}&pm_processSheet_id=${row.procsheet_id}&pm_processtype_id=${row.co_param_val_id}&pm_approved_by=${userId}&test_date=${row.test_date}&menuId=${menuId}`
          : row.pm_test_id == 987 ? `/peel-test/${row.procsheet_id}&${row.pm_test_run_id}&${testingtype}&${row.pm_test_id}&pm_Approve_level=${action}&pm_project_id=${row.project_id}&pm_processSheet_id=${row.procsheet_id}&pm_processtype_id=${row.co_param_val_id}&pm_approved_by=${userId}&test_date=${row.test_date}&menuId=${menuId}`
            : testingtype === '609' || row.pm_test_id == 284 || row.pm_test_id == 303 || row.pm_test_id == 304 ? `/field-test/${row.procsheet_id}&${row.pm_test_run_id}&${testingtype}&${row.pm_test_id}&pm_Approve_level=${action}&pm_project_id=${row.project_id}&pm_processSheet_id=${row.procsheet_id}&pm_processtype_id=${row.co_param_val_id}&pm_approved_by=${userId}&test_date=${row.test_date}&menuId=${menuId}`
              : row.pm_test_id == 986 || row.pm_test_id == 293 ? `/indentation-test/${row.procsheet_id}&${row.pm_test_run_id}&${testingtype}&${row.pm_test_id}&pm_Approve_level=${action}&pm_project_id=${row.project_id}&pm_processSheet_id=${row.procsheet_id}&pm_processtype_id=${row.co_param_val_id}&pm_approved_by=${userId}&test_date=${row.test_date}&menuId=${menuId}`
                : row.pm_test_id == 325 ? `/calibration-blasting-report-view/${row.pm_test_run_id}&${row.pm_test_id}&${testingtype}&pm_Approve_level=view&pm_project_id=${row.project_id}&pm_processSheet_id=${row.procsheet_id}&pm_processtype_id=${row.co_param_val_id}&pm_approved_by=${userId}&test_date=${row.test_date}&menuId=${menuId}`
                  : `/porosity-test/${row.procsheet_id}&${row.pm_test_run_id}&${testingtype}&${row.pm_test_id}&pm_Approve_level=${action}&pm_project_id=${row.project_id}&pm_processSheet_id=${row.procsheet_id}&pm_processtype_id=${row.co_param_val_id}&pm_approved_by=${userId}&test_date=${row.test_date}&menuId=${menuId}`
  };

  const gotoEdit = (action, row) => {
    return testingtype === '605' ? `/inhousetest?menuId=${menuId}&testingtype=${testingtype}&action=edit&ProcessSheetID=${row?.procsheet_id}&ProcessSheetTypeID=${testingtype}&TestRunId=${row?.pm_test_run_id}&TestId=${row?.pm_process_subtype_id}`
      : testingtype === '607' ? `/beforeprocesslabtest?menuId=${menuId}&testingtype=${testingtype}&action=edit&ProcessSheetID=${row?.procsheet_id}&ProcessSheetTypeID=${testingtype}&TestRunId=${row?.pm_test_run_id}&TestId=${row?.pm_process_subtype_id}`
        : testingtype === '609' ? `/fieldtest?menuId=${menuId}&testingtype=${testingtype}&action=edit&ProcessSheetID=${row?.procsheet_id}&ProcessSheetTypeID=${testingtype}&TestRunId=${row?.pm_test_run_id}&TestId=${row?.pm_test_id}`
          : row.pm_test_id == 325 ? `/calibration-blasting-report?menuId=${menuId}&action=edit&year=2024&ProcessSheetID=${row?.procsheet_id}&ProcessSheetTypeID=${testingtype}&TestRunId=${row?.pm_test_run_id}&pm_blasting_test_run_id=256`
            : `/labtest?menuId=${menuId}&testingtype=${testingtype}&action=edit&ProcessSheetID=${row?.procsheet_id}&ProcessSheetTypeID=${testingtype}&TestRunId=${row?.pm_test_run_id}&TestId=${row?.pm_test_id}`
  }

  const handleViewClick = (data) => {
    navigate(getProcessUrl('view', data));
  };
  const handleEdit = (data) => {
    navigate(gotoEdit("edit", data));
  };
  const handleFirstLevel = (data) => {
    navigate(getProcessUrl("first", data));
  };
  const handleSecondLevel = (data) => {
    navigate(getProcessUrl("second", data));
  };

  // -------------------------------------------------

  const fetchData = async () => {
    try {
      const response1 = await axios.get(Environment.BaseAPIURL + `/api/User/GetTestlist?grphdrid=${testingtype}`)
      setOptions(response1.data[0]);

      const response = await axios.get(Environment.BaseAPIURL + `/api/User/GetTestTemplateforCoatType`)
      if (response.data) {
        if (testingtype !== '605' && testingtype !== '607') {
          GetLabFieldDataList();
        }
        else if (testingtype === '607') {
          GetBeforeProcessDataList();
        }
        else {
          GetRawMaterialDataList();
        }
      }
    }
    catch (error) {
      console.error('There was a problem fetching the data:', error);
    };
  };

  const GetLabFieldDataList = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('pm_process_type_id', testingtype);
      const response = await axios.get(Environment.BaseAPIURL + `/api/User/GetInProcessLabFieldTestingAsync?ProcessType=${testingtype}&UserId=${userId}`);
      if (Array.isArray(response.data)) {
        setData(response.data);
        fetchPermissions();
      } else {
        toast.error('Data received from the API is not in the expected format.');
      }
    } catch (error) {
      console.error('Error fetching details:', error);
    } finally {
      setLoading(false);
    }
  };

  const GetBeforeProcessDataList = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('pm_process_type_id', testingtype);
      const response = await axios.get(Environment.BaseAPIURL + `/api/User/GetBeforeProcessDataList?ProcessType=${testingtype}&UserId=${userId}`);
      if (Array.isArray(response.data)) {
        setData(response.data[0]);
        fetchPermissions();
      } else {
        toast.error('Data received from the API is not in the expected format.');
      }
    } catch (error) {
      console.error('Error fetching details:', error);
    } finally {
      setLoading(false);
    }
  };

  const GetRawMaterialDataList = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('pm_process_type_id', testingtype);
      const response = await axios.get(Environment.BaseAPIURL + `/api/User/GetRMTestingDataList?ProcessType=${testingtype}&UserId=${userId}`);
      if (Array.isArray(response.data)) {
        setData(response.data[0]);
        fetchPermissions();
      } else {
        toast.error('Data received from the API is not in the expected format.');
      }
    } catch (error) {
      console.error('Error fetching details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestTypeChange = event => {
    setSelectedTest(event.target.value);
  };

  const [clientFilter, setClientFilter] = useState('');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    filterTableData(data);
  }, [selectedTest, fromDate, toDate, data, clientFilter, searchText]);

  const renderDropdownFilters = () => {
    const uniqueClients = [...new Set(data.map(item => item?.clientname))];

    return (
      <>
        <div className='tableheaderDate'>
          <label>Client</label>
          <select value={clientFilter} onChange={(e) => setClientFilter(e.target.value)}>
            <option value="">All</option>
            {uniqueClients.map((client, index) => (
              <option key={index} value={client}>{client}</option>
            ))}
          </select>
        </div>
        <i className="fa fa-refresh" onClick={resetFilter}></i>
      </>
    );
  };

  const filterTableData = (data) => {
    return data.filter(row => {
      const testDate = new Date(row.co_created_on);
      return (
        (!fromDate || testDate >= new Date(fromDate)) &&
        (!toDate || testDate <= new Date(toDate)) &&
        (!clientFilter || row.clientname === clientFilter) &&
        (!selectedTest || row.process_type_sub === selectedTest || row.co_param_val_name1 === selectedTest) &&
        (!searchText || row.pm_procsheet_code.toLowerCase().includes(searchText.toLowerCase()))
      );
    });
  };

  const displayData = filterTableData(data).slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  const pageCount = Math.ceil(filterTableData(data).length / pageSize);

  const handlePageClick = data => {
    setCurrentPage(data.selected);
  };

  const resetFilter = () => {
    setFromDate(null);
    setToDate(null);
    setSelectedTest('');
    setClientFilter('');
    setSearchText('');
  };

  // ---------------------------------------------------

  const [images, setImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    // Function to read a file and return its base64 representation
    const readFileAsBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]); // Extract base64 data part
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };

    // Process each file, read its base64 value, and then update the state
    const processFiles = async () => {
      const newImages = await Promise.all(
        acceptedFiles.map(async (file) => {
          const base64 = await readFileAsBase64(file); // Wait for the base64 conversion
          return {
            id: Math.random(),
            file,
            preview: URL.createObjectURL(file),
            base64, // Set the base64 value
          };
        })
      );

      setImages((prevImages) => [...prevImages, ...newImages]); // Update state with new images
    };

    processFiles(); // Call the async function to process files
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [] },
    multiple: true,
  });

  const removeImage = (id) => {
    setImages(images.filter((image) => image.id !== id));
  };

  const moveImageUp = (index) => {
    if (index === 0) return;
    const newImages = [...images];
    const temp = newImages[index];
    newImages[index] = newImages[index - 1];
    newImages[index - 1] = temp;
    setImages(newImages);
  };

  const moveImageDown = (index) => {
    if (index === images.length - 1) return;
    const newImages = [...images];
    const temp = newImages[index];
    newImages[index] = newImages[index + 1];
    newImages[index + 1] = temp;
    setImages(newImages);
  };

  async function sendImages(data) {
    const fileData = images.map((item, index) => ({
      file_name: item.file.name,
      file_data: item.base64, // Extract base64 data part
      seq_no: index + 1,
    }));

    const dataToSend = {
      comp_id: 1,
      loc_id: 1,
      test_run_id: data.pm_test_run_id,
      procsheet_id: data.procsheet_id,
      testfileid: 0,
      userid: userId,
      filedata: fileData
    }

    try {
      const response = await axios.post(`${Environment.BaseAPIURL}/api/User/UploadReportAttachment`, dataToSend);

      const responseBody = await response.text();
      if (responseBody === "1000") {
        setIsModalOpen(false)
        toast.success("Form data sent successfully!");
        console.log("Form data sent successfully!");
      } else {
        console.error("Failed to send form data to the server. Status code:", response.status);
        console.error("Server response:", responseBody);
      }
    } catch (error) {
      console.error("An error occurred while sending form data:", error);
    }
  }

  return (
    <>
      {
        loading ? (<Loading />) : (
          <>
            <Header />
            <section className='InnerHeaderPageSection'>
              <div className='InnerHeaderPageBg' style={{ backgroundImage: `url(${RegisterEmployeebg})` }}></div>
              <div className='container'>
                <div className='row'>
                  <div className='col-md-12 col-sm-12 col-xs-12'>
                    <ul>
                      <li> <Link to='/dashboard?moduleId=618'>Quality Module</Link></li>
                      <b style={{ color: '#fff' }}>/ &nbsp;</b>
                      <li> <Link to={`/inspectiontesting?menuId=${menuId}`}> Testing </Link> <b style={{ color: '#fff' }}></b></li>
                      <li><h1>/ &nbsp; {testingtypeval} List</h1></li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className='RawmateriallistPageSection'>
              <div className='container'>
                <div className='row'>
                  <div className='col-md-12 col-sm-12 col-xs-12'>
                    <div className='RawmateriallistTables'>
                      <span><i className="fas fa-filter"></i> Filter </span>
                      <div className='tableheaderflex'>
                        <div className='tableheaderfilter'>
                          <div className='tableheaderDate'>
                            <label> From Date:</label>
                            <DatePicker
                              maxDate={new Date()}
                              selected={fromDate}
                              onChange={(date) => setFromDate(date)}
                              dateFormat="dd-MM-yyyy"
                              placeholderText="DD-MM-YYYY"
                            />
                          </div>
                          <div className='tableheaderDate'>
                            <label> To Date: </label>
                            <DatePicker
                              maxDate={new Date()}
                              selected={toDate}
                              onChange={(date) => setToDate(date)}
                              dateFormat="dd-MM-yyyy"
                              placeholderText="DD-MM-YYYY"
                            />
                          </div>
                          <div className='tableheaderDate'>
                            <label htmlFor="">Search Process Sheet No.</label>
                            <input
                              type="text"
                              placeholder="Search by Process Sheet No."
                              value={searchText}
                              onChange={(e) => setSearchText(e.target.value)}
                            />
                          </div>
                          {renderDropdownFilters()}
                        </div>
                        <div className='tableheaderAddbutton'>
                          {permissions?.createPerm === "1" && <Link style={{ float: 'right' }} to={addscreenurl} target='_blank'><i className="fas fa-plus"></i> Add</Link>}
                        </div>
                      </div>
                      <div className='RawmaterialTestTypeFlexSection'>
                        <div className='form-group' >
                          <label htmlFor="testType">Test Type</label>
                          <select id="testType" value={selectedTest}
                            onChange={handleTestTypeChange}>
                            <option value=''>Select Type</option>
                            {options.map(option => (
                              <option key={option.pm_test_id} value={option.pm_test_id}>{option.co_param_val_name}</option>
                            ))}
                          </select>
                        </div>

                        <ul className='Rawmaterialinspectionlistlegend'>
                          <li><i className="fas fa-eye" style={{ color: "#4caf50" }} ></i>View</li>
                          <li><i className="fas fa-edit" style={{ color: "#ff9800" }} ></i>Edit</li>
                          <li><i className="fas fa-check" style={{ color: "#4caf50" }} ></i>Single level Approval</li>
                          <li><i className="fas fa-check-double" style={{ color: "#4caf50" }} ></i>Double level Approval</li>
                        </ul>
                      </div>
                      {loading ? (<Loading />) : (
                        <><div className='table-responsive' id='custom-scroll'>
                          <table>
                            <thead>
                              <tr style={{ background: 'rgb(90, 36, 90)' }}>
                                <th style={{ minWidth: '65px' }}>Sr. No.</th>
                                <th style={{ minWidth: '120px' }}>Process Sheet No.</th>
                                <th style={{ minWidth: '250px' }}>Client Name</th>
                                <th style={{ minWidth: '250px' }}>Project Name</th>
                                <th style={{ minWidth: '100px' }}>Test Date</th>
                                <th style={{ minWidth: '200px' }}>Test</th>
                                {/* {testingtype === '608' || testingtype === '609' ? <th style={{ minWidth: '180px' }}>Saved/Unsaved Pipes</th> : ''} */}
                                <th style={{ minWidth: '100px' }}>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {displayData.length === 0 ? (
                                <tr><td colSpan="8">No data found.</td></tr>
                              ) : (
                                displayData.map((row, index) => (
                                  <tr key={index}>
                                    <td>{currentPage * pageSize + index + 1}</td>
                                    <td>{row.pm_procsheet_code.split('/').slice(-2).join('/')}</td>
                                    <td>{row.clientname}</td>
                                    <td>{row.project_name}</td>
                                    <td>{new Date(row.co_created_on).toLocaleDateString('en-GB').replace(/\//g, "-")}</td>
                                    <td>{testingtype === '607' || testingtype === '609' || testingtype === '608' || testingtype === '605' ? row.process_type_sub : row.co_param_val_name1}</td>
                                    {/* {(testingtype === '608' || testingtype === '609') ? row.pm_test_id !== 325 ?
                                      <td>{row?.SavedCount} - Saved , {row?.USavedCount} - Unsaved</td> : <td></td> : ""} */}
                                    <td>
                                      <div style={{ display: 'flex' }}>
                                        {permissions?.indexPerm === "1" && (
                                          <i className="fas fa-eye" onClick={() => handleViewClick(row)} style={{ color: "#4CAF50", margin: '4px', cursor: "pointer" }}></i>
                                        )}
                                        {permissions?.firstLevelApprove === "1" && row.IsShowForFirstLevelApproval === 1 && (
                                          <i className="fas fa-check" onClick={() => handleFirstLevel(row)} style={{ color: "#4CAF50", margin: '4px', cursor: "pointer" }}></i>
                                        )}
                                        {permissions?.secondLevelApprove === "1" && row.IsShowForSecondLevelApproval === 1 && (
                                          <i className="fas fa-check-double" onClick={() => handleSecondLevel(row)} style={{ color: "#4CAF50", margin: '4px', cursor: "pointer" }}></i>
                                        )}
                                        {permissions?.editPerm === "1" && row.IsSubmitted === 1 && (
                                          <i className="fas fa-edit" onClick={() => handleEdit(row)} style={{ color: "#ff9800", margin: '4px', cursor: "pointer" }}></i>
                                        )}

                                        <div className='faUploadModalBox'>
                                          <button onClick={() => { setIsModalOpen(true); setSelectedRow(row); setImages([]) }} style={{ cursor: 'pointer', background: 'none', border: 'none' }}>
                                            <FontAwesomeIcon icon={faUpload} size="2x" />
                                          </button>

                                          <Modal
                                            isOpen={isModalOpen}
                                            onRequestClose={() => setIsModalOpen(false)}
                                            contentLabel="Image Upload Modal"
                                            style={{
                                              overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
                                              content: { width: '40%', margin: 'auto', padding: '20px', borderRadius: '10px' }
                                            }}
                                          >
                                            <h2>Upload Images<i onClick={() => setIsModalOpen(false)} className='fas fa-times'></i></h2>
                                            <div {...getRootProps({ className: 'dropzone' })}>
                                              <input {...getInputProps()} />
                                              <FontAwesomeIcon icon={faUpload} size="2x" />
                                              <p>Drag & drop or click to select images (JPEG/PNG only)</p>
                                            </div>
                                            <div className="image-preview-container" style={{ marginTop: '20px' }}>
                                              <div className='LegendUploadModalBox'>
                                                <span><FontAwesomeIcon icon={faTrash} /> Delete</span>
                                                <span><FontAwesomeIcon icon={faArrowUp} /> Drag Up</span>
                                                <span><FontAwesomeIcon icon={faArrowDown} /> Drag Down</span>
                                              </div>
                                              {images.map((image, index) => (
                                                <>
                                                  <div key={image.id} className="image-preview" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                      <p style={{ marginRight: '10px' }}>{index + 1}</p>
                                                      <img src={image.preview} alt={`Preview ${index + 1}`} style={{ width: '30px', height: '30px', objectFit: 'cover' }} />
                                                    </div>
                                                    <div>
                                                      <FontAwesomeIcon title='Delete' onClick={() => removeImage(image.id)} icon={faTrash} />
                                                      <FontAwesomeIcon title='Drag Up' onClick={() => moveImageUp(index)} icon={faArrowUp} />
                                                      <FontAwesomeIcon title='Drag Down' onClick={() => moveImageDown(index)} icon={faArrowDown} />
                                                    </div>
                                                  </div>
                                                </>
                                              ))}
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'end' }}>
                                              {images.length ? <button className='btn btn-primary' onClick={() => { sendImages(selectedRow); }}>Submit</button> : ''}
                                            </div>
                                          </Modal>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div></>
                      )}
                      <Pagination pageCount={pageCount} onPageChange={handlePageClick} />
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <Footer />
          </>)
      }
    </>
  )
}

export default Rawmateriallist;