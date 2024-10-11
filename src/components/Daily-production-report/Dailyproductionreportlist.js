import React, { useState, useEffect } from 'react';
import './Dailyproductionreport.css'
import Header from '../Common/Header/Header'
import Footer from '../Common/Footer/Footer'
import Loading from '../Loading';
import RegisterEmployeebg from '../../assets/images/RegisterEmployeebg.jpg';
import { Link, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Environment from "../../environment";

import { AgGridReact } from "ag-grid-react";

function Dailyproductionreportlist() {

  const [data, setData] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [testingType, setTestingType] = useState('');

  useEffect(() => {
    // fetchData();
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 2000);
  }, []);

  useEffect(() => {
    GeWorkinstructiontList();
  }, []);

  const filterData = () => {
    try {
      const filteredData = data.filter(item => {
        const testDate = new Date(item.testDate);
        return (!fromDate || testDate >= new Date(fromDate)) && (!toDate || testDate <= new Date(toDate) &&
          (!testingType || item.testType === testingType));
      });
      return filteredData;
    } catch (ex) {
      console.log(ex);
    }
  };

  const searchParams = new URLSearchParams(document.location.search);
  let testingtype = searchParams.get('testingtype');
  let testingtypeval = "Daily Production Report";
  let addscreenurl = "/dailyproductionreport";

  const filteredData = filterData();

  // -------------------------------------------------

  const GeWorkinstructiontList = async () => {
    try {
      const params = new URLSearchParams();

      const response = await axios.get(Environment.BaseAPIURL + `/api/User/GetWorkinstructionData`);
      if (Array.isArray(response.data)) { // Check if response.data is an array
        setData(response.data);
      } else {
        toast.error('Data received from the API is not in the expected format.');
      }
    } catch (error) {
      toast.error('Failed' + error.message);
      console.error('Failed', error.message);
    }
  };

  let sno = 0;
  data.forEach(function (value, i) {
    ++sno;
    value['sno'] = sno;

  });

  const fetchData = () => {
    axios.get(Environment.BaseAPIURL + `/api/User/GetTestTemplateforCoatType`)
      .then(response => {
        setOptions(response.data.filter(option => option.pm_test_level === 2 && option.co_param_val_pid === 183));
      })
      .catch(error => {
        console.error('There was a problem fetching the data:', error);
      });
  };

  const handleTestTypeChange = event => {
    setTestingType(event.target.value);
  };

  const handleViewClick = () => {
    window.open('/dailyproductionreportview', '_blank');
  };

  const handleEditClick = () => {
    window.open('/dailyproductionreportedit', '_blank');
  };

  const actionCellRenderer = () => (
    <div className="action-icons">
      <i className="fas fa-eye" onClick={handleViewClick} style={{ color: "#4CAF50", margin: '4', paddingRight: "10px", cursor: "pointer", borderRight: "1px solid #afafaf", marginRight: "10px" }}></i>

      <i className="fas fa-edit" onClick={handleEditClick} style={{ color: "#3d7edb", margin: '4', paddingRight: "10px", cursor: "pointer" }}></i>
    </div>
  );

  const columnDefs = [
    { headerName: 'S No.', field: 'pm_workinst_detail_id', width: 65, headerClass: 'custom-header' },
    // { headerName: "Workinst Doc", field: "pm_workinst_detail_id", width: 150, headerClass: 'custom-header' },
    { headerName: "Document Title", field: "pm_workinst_doc_title", width: 500, headerClass: 'custom-header' },
    { headerName: "Identification No.", field: "pm_work_instruction_id", width: 200, headerClass: 'custom-header' },
    { headerName: "Rev. No.", field: "pm_workinst_doc_rev", width: 100, headerClass: 'custom-header align-center' },
    { headerName: "Issue No.", field: "pm_workinst_doc_issue", width: 100, headerClass: 'custom-header align-center' },
    {
      headerName: "Action",
      cellRenderer: actionCellRenderer,
      width: 90, headerClass: 'custom-header'
    },
  ];

  const navigate = useNavigate();

  return (
    <>
      {
        loading ?
          <Loading />
          :
          <>
            <Header />
            <section className='InnerHeaderPageSection'>
              <div className='InnerHeaderPageBg' style={{ backgroundImage: `url(${RegisterEmployeebg})` }}></div>
              <div className='container'>
                <div className='row'>
                  <div className='col-md-12 col-sm-12 col-xs-12'>
                    <ul>
                      <li> <Link to='/ppcdashboard?moduleId=617'>PPC Module</Link></li>
                      <li><h1>/ &nbsp; Daily Production Report List</h1></li>
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
                      <h4>{testingtypeval} <span>- List page</span></h4>
                      <div className='tableheaderflex'>
                        <div className='tableheaderfilter'>
                          <span><i className="fas fa-filter"></i> Filter Test Data</span>
                          <label>
                            From Date:
                            {/* <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} /> */}
                            <DatePicker
                              maxDate={Date.now()}
                              selected={fromDate}
                              onChange={setFromDate}
                              dateFormat="dd/MMM/yyyy"
                              placeholderText="DD/MMM/YYYY"
                            />
                          </label>
                          <label>
                            To Date:
                            {/* <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} /> */}
                            <DatePicker
                              maxDate={Date.now()}
                              selected={toDate}
                              onChange={setToDate}
                              dateFormat="dd/MMM/yyyy"
                              placeholderText="DD/MMM/YYYY"
                            />
                          </label>
                        </div>
                        <div className='tableheaderAddbutton'>
                          <Link style={{ float: 'right' }} to={addscreenurl} target='_blank'><i className="fas fa-plus"></i> Add</Link>
                        </div>
                      </div>

                      {/* SUMIT */}
                      <div className="fadedIcon">
                        <li><i className="fa-solid fa-eye" style={{ color: "#4caf50" }} ></i>View</li>
                        <li><i className="fa-solid fa-edit" style={{ color: "#3d7edb" }} ></i>Edit</li>
                      </div>
                      {/* END SUMIT */}

                      <div className="ag-theme-alpine" style={{ height: "400px", width: "100%" }} >
                        <AgGridReact
                          columnDefs={columnDefs}
                          rowData={filteredData}
                          pagination={true}
                          suppressDragLeaveHidesColumns="true"
                          paginationPageSize={50}
                        />
                      </div>
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

export default Dailyproductionreportlist