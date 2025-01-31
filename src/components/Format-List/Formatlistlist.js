import React, { useState, useEffect } from 'react';
import './Formatlistlist.css'
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

function Formatlistlist() {

  const navigate = useNavigate();

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
    GetFormatlistlistData();
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
  let testingtypeval = "Format List";

  const filteredData = filterData();

  // -------------------------------------------------

  const GetFormatlistlistData = async () => {
    try {
      const params = new URLSearchParams();
      params.append('pm_process_type_id', testingtype);
      const response = await axios.get(Environment.BaseAPIURL + `/api/User/GetFormatlistlistData`);
      if (Array.isArray(response.data)) {
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

  const handleViewClick = (data) => {
    console.log(data)
    navigate(`/formatlistview?id=${data.data.pm_format_id}`)
  };

  const handleListClick = (data) => {
    navigate(`/formatlistedit?id=${data.data.pm_format_id}`)
  };

  const actionCellRenderer = (params) => (
    <div className="action-icons">
      <Link to={`/formatlistview?id=${params.data.pm_format_id}`} className="fas fa-eye" style={{ color: "#4CAF50", margin: '4', paddingRight: "10px", cursor: "pointer", borderRight: "1px solid #afafaf", marginRight: "10px" }}></Link>

      <Link to={`/formatlistedit?id=${params.data.pm_format_id}`} className="fas fa-edit" style={{ color: "#4CAF50", margin: '4', paddingRight: "10px", cursor: "pointer" }}></Link>
    </div>
  );

  const columnDefs = [
    { headerName: 'S No.', field: 'pm_format_id', width: 65, headerClass: 'custom-header' },
    { headerName: "Format Description", field: "pm_format_desc", width: 450, headerClass: 'custom-header' },
    { headerName: "Format No.", field: "pm_format_no", width: 200, headerClass: 'custom-header' },
    { headerName: "Revision No.", field: "pm_format_revision", width: 140, headerClass: 'custom-header align-center' },
    {
      headerName: "Date",
      field: "pm_format_rev_date",
      width: 180,
      headerClass: 'custom-header align-center',
      valueFormatter: (params) => {
        if (params.value) {
          const date = new Date(params.value);
          return date.toLocaleDateString('en-GB');
        }
        return '';
      }
    },
    {
      headerName: "Action",
      cellRenderer: actionCellRenderer,
      width: 90,
      headerClass: 'custom-header'
    },
  ];

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
                      <li> <Link to='/dashboard?moduleId=618'>Quality Module</Link></li>
                      <li><h1>/ &nbsp; {testingtypeval}</h1></li>
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
                            <DatePicker
                              maxDate={Date.now()}
                              selected={fromDate}
                              onChange={date => setFromDate(date)}
                              dateFormat="dd/MMM/yyyy"
                              placeholderText="DD/MMM/YYYY"
                            />
                          </label>
                          <label>
                            To Date:
                            <DatePicker
                              maxDate={Date.now()}
                              selected={toDate}
                              onChange={date => setToDate(date)}
                              dateFormat="dd/MMM/yyyy"
                              placeholderText="DD/MMM/YYYY"
                            />
                          </label>
                        </div>
                        <div className='tableheaderAddbutton'>
                          <Link style={{ float: 'right' }} to='/Formatlist'><i className="fas fa-plus"></i> Add</Link>
                        </div>
                      </div>

                      <div className="ag-theme-alpine" style={{ height: "400px", width: "100%" }} >
                        <div className='DownloadExcelFlexBox'>
                          <ul>
                            <li><i className="fa-solid fa-eye" style={{ color: "#4caf50" }} ></i>View</li>
                            <li><i className="fa-solid fa-edit" style={{ color: "#4caf50" }} ></i>Edit</li>
                          </ul>

                          <a href="/assets/excel-files/calibration-list.xlsx" download>
                            <button className='DownloadExcelBtn'>
                              Download Excel
                            </button>
                          </a>
                        </div>
                        <AgGridReact
                          columnDefs={columnDefs}
                          rowData={filteredData}
                          pagination={true}
                          paginationPageSize={50}
                          suppressDragLeaveHidesColumns="true"
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

export default Formatlistlist;
