import React, { useState, useEffect } from 'react';
import './Dailyproductionreport.css';
import Loading from '../Loading';
import Header from '../Common/Header/Header';
import Footer from '../Common/Footer/Footer';
import RegisterEmployeebg from '../../assets/images/RegisterEmployeebg.jpg';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Environment from "../../environment";

function Dailyproductionreport() {
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState('');
  const [type, setType] = useState('');
  const [headerData, setHeaderData] = useState({});
  const [processSheetNumber, setProcessSheetNumber] = useState('');
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [formData, setFormData] = useState({
    pm_work_instruction_id: '',
    pm_workinst_doc_id: '',
    pm_workinst_doc_title: '',
    pm_workinst_doc_rev: ''
  });

  const handleTypeChange = (e) => {
    const { name, value } = e.target;
    if (name === "year") {
      setYear(value);
    } else {
      setType(value);
    }
  };

  const handleTypeBlur = () => {
    callApi();
  }

  const callApi = async () => {
    try {
      if (year && type) {
        const response = await axios.post(`${Environment.BaseAPIURL}/api/User/getEPOXYProcessSheetDetails?processsheetno=${type}&year=${year}`);
        const firstDataItem = response.data.Table[0];
        setHeaderData(firstDataItem || []);
        setShowAdditionalFields(parseInt(type) > 0);
        setProcessSheetNumber(type);
      } else {
        console.error('Invalid year or type:', year, type);
      }
    } catch (error) {
      console.error('Error fetching process sheet details:', error);
    }
  };

  const [ddlYear, setddlYear] = useState([]);

  const getYear = () => {
    axios.get(Environment.BaseAPIURL + "/api/User/getprocsheetyear")
      .then((response) => {
        const sortedYears = response.data.sort((a, b) => b.year - a.year);
        setddlYear(sortedYears);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    getYear();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

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
                      <li><b style={{ color: '#fff' }}>/&nbsp;</b> <Link to={`/dailyproductionreportlist?menuId=26`}> Daily Production Report List</Link></li>
                      <li><h1>/ &nbsp; Daily Production Report</h1></li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className='WorkinstructionviewSection RegisterEmployeePageSection'>
              <div className='container'>
                <div className='row'>
                  <div className='col-md-12 col-sm-12 col-xs-12'>
                    <form className="RegisterEmployeeForm row m-0">
                      <div className="col-md-12 col-sm-12 col-xs-12">
                        <h4>Daily Production Report <span style={{ color: "#34B233" }}>- Add page </span></h4>
                      </div>
                      <div className='col-md-4 col-sm-4 col-xs-12'>
                        <div className='form-group'>
                          <label htmlFor="processSheet">Process Sheet</label>
                          <div className='ProcessSheetFlexBox'>
                            <input id="processSheet" style={{ width: '66%', cursor: 'not-allowed', marginBottom: '0' }} value={headerData.processsheetcode} placeholder='Process sheet no.' readOnly />
                            <select name="year" value={year} onChange={handleTypeChange} >
                              <option value=""> Year </option>
                              {ddlYear.map((coatingTypeOption, i) => (
                                <option key={i} value={coatingTypeOption.year}> {coatingTypeOption.year} </option>
                              ))}
                            </select>
                            <b>-</b>
                            <input id="type" type="text" placeholder='No.' value={type} onChange={handleTypeChange} onBlur={handleTypeBlur} style={{ marginBottom: '0 !important' }} />
                          </div>
                        </div>
                      </div>
                      {[
                        { id: 'clientName', label: 'Client Name', value: headerData?.clientname != undefined ? headerData?.clientname : '' },
                        { id: 'projectName', label: 'Project Name', value: headerData?.projectname != undefined ? headerData?.projectname : '' },
                        { id: 'pipeSize', label: 'Pipe Size', value: headerData?.pipesize != undefined ? headerData?.pipesize : '' },
                        { id: 'specification', label: 'Specification', value: headerData?.specification != undefined ? headerData?.specification : '' },
                        { id: 'poNo', label: 'PO.NO/LOA.NO', value: headerData?.PONo != undefined ? headerData?.PONo : '' },
                        { id: 'dated', label: 'Dated', value: new Date(headerData?.testdate).toLocaleDateString('en-GB') != undefined ? new Date(headerData?.testdate).toLocaleDateString('en-GB') : '' },
                        { id: 'shift', label: 'Shift', value: headerData?.pm_shiftvalue != undefined ? headerData?.pm_shiftvalue : '' },
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

                      <div className='col-md-4 col-sm-4 col-xs-12'>
                        <div className='form-group'>
                          <label>P.O. Order Quantity. (Mtrs)</label>
                          <input
                            type='text'
                            value={10}
                            placeholder='P.O.Order Quantity. (Mtrs)'
                            style={{ cursor: 'not-allowed' }}
                            readOnly
                          />
                        </div>
                      </div>

                      <div className='col-md-4 col-sm-4 col-xs-12'>
                        <div className='form-group'>
                          <label>Order Quantity Pipes Approx.</label>
                          <input
                            type='text'
                            value={10}
                            placeholder='Order Quantity Pipes Approx.'
                            style={{ cursor: 'not-allowed' }}
                            readOnly
                          />
                        </div>
                      </div>

                      <div className='col-md-4 col-sm-4 col-xs-12'>
                        <div className='form-group'>
                          <label>BARE PIPE RECEIVED</label>
                          <input
                            type='text'
                            value={10}
                            placeholder='BARE PIPE RECEIVED'
                            style={{ cursor: 'not-allowed' }}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className='col-md-4 col-sm-4 col-xs-12'>
                        <div className='form-group'>
                          <label>BARE PIPE RECEIVED LENGTH (Mtrs)</label>
                          <input
                            type='text'
                            value={10}
                            placeholder='BARE PIPE RECEIVED LENGTH (Mtrs)'
                            style={{ cursor: 'not-allowed' }}
                            readOnly
                          />
                        </div>
                      </div>

                      <div className='col-md-4 col-sm-4 col-xs-12'>
                        <div className='form-group'>
                          <label>NO. OF PIPES PROCESSED</label>
                          <input
                            type='text'
                            value={10}
                            placeholder='NO. OF PIPES PROCESSED'
                            style={{ cursor: 'not-allowed' }}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className='col-md-4 col-sm-4 col-xs-12'>
                        <div className='form-group'>
                          <label>BARE</label>
                          <input
                            type='text'
                            value={10}
                            placeholder='BARE'
                            style={{ cursor: 'not-allowed' }}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className='col-md-4 col-sm-4 col-xs-12'>
                        <div className='form-group'>
                          <label>NTC</label>
                          <input
                            type='text'
                            value={10}
                            placeholder='NTC'
                            style={{ cursor: 'not-allowed' }}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className='col-md-4 col-sm-4 col-xs-12'>
                        <div className='form-group'>
                          <label>H/C & S/C</label>
                          <input
                            type='text'
                            value={10}
                            placeholder='H/C & S/C'
                            style={{ cursor: 'not-allowed' }}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className='col-md-4 col-sm-4 col-xs-12'>
                        <div className='form-group'>
                          <label>3LPE PIPES COATED</label>
                          <input
                            type='text'
                            value={10}
                            placeholder='3LPE PIPES COATED'
                            style={{ cursor: 'not-allowed' }}
                            readOnly
                          />
                        </div>
                      </div>

                      <div className='col-md-4 col-sm-4 col-xs-12'>
                        <div className='form-group'>
                          <label>3LPE COATING PROCESS REJECTION</label>
                          <input
                            type='text'
                            value={10}
                            placeholder='3LPE COATING PROCESS REJECTION'
                            style={{ cursor: 'not-allowed' }}
                            readOnly
                          />
                        </div>
                      </div>

                      <div className='col-md-4 col-sm-4 col-xs-12'>
                        <div className='form-group'>
                          <label>3LPE COATING OK</label>
                          <input
                            type='text'
                            value={10}
                            placeholder='3LPE COATING OK'
                            style={{ cursor: 'not-allowed' }}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className='col-md-4 col-sm-4 col-xs-12'>
                        <div className='form-group'>
                          <label>BALANCE FOR INSPECTION AFTER COATING</label>
                          <input
                            type='text'
                            value={10}
                            placeholder='BALANCE FOR INSPECTION AFTER COATING'
                            style={{ cursor: 'not-allowed' }}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className='col-md-4 col-sm-4 col-xs-12'>
                        <div className='form-group'>
                          <label>TPI ACCEPTED (NOS)</label>
                          <input
                            type='text'
                            value={10}
                            placeholder='TPI ACCEPTED (NOS)'
                            style={{ cursor: 'not-allowed' }}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className='col-md-4 col-sm-4 col-xs-12'>
                        <div className='form-group'>
                          <label>TPI ACCEPTED (NOS)</label>
                          <input
                            type='text'
                            value={10}
                            placeholder='TPI ACCEPTED (NOS)'
                            style={{ cursor: 'not-allowed' }}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className='col-md-4 col-sm-4 col-xs-12'>
                        <div className='form-group'>
                          <label>ACCEPTED LENGTH ( MTR. )</label>
                          <input
                            type='text'
                            value={10}
                            placeholder='ACCEPTED LENGTH ( MTR. )'
                            style={{ cursor: 'not-allowed' }}
                            readOnly
                          />
                        </div>
                      </div>

                      <div className='col-md-4 col-sm-4 col-xs-12'>
                        <div className='form-group'>
                          <label>PIPE RELEASED (NOS)</label>
                          <input
                            type='text'
                            value={10}
                            placeholder='PIPE RELEASED (NOS)'
                            style={{ cursor: 'not-allowed' }}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className='col-md-4 col-sm-4 col-xs-12'>
                        <div className='form-group'>
                          <label>PIPE RELEASE (IN MTR)</label>
                          <input
                            type='text'
                            value={10}
                            placeholder='PIPE RELEASE (IN MTR)'
                            style={{ cursor: 'not-allowed' }}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className='col-md-4 col-sm-4 col-xs-12'>
                        <div className='form-group'>
                          <label>PIPE DISPATCHED (PCS)</label>
                          <input
                            type='text'
                            value={10}
                            placeholder='PIPE DISPATCHED (PCS)'
                            style={{ cursor: 'not-allowed' }}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className='col-md-4 col-sm-4 col-xs-12'>
                        <div className='form-group'>
                          <label>PIPE DISPATCHED (MTR)</label>
                          <input
                            type='text'
                            value={10}
                            placeholder='PIPE DISPATCHED (MTR)'
                            style={{ cursor: 'not-allowed' }}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className='col-md-4 col-sm-4 col-xs-12'>
                        <div className='form-group'>
                          <label>PIPE BALANCE FOR DISPATCH (MTR)</label>
                          <input
                            type='text'
                            value={10}
                            placeholder='PIPE BALANCE FOR DISPATCH (MTR)'
                            style={{ cursor: 'not-allowed' }}
                            readOnly
                          />
                        </div>
                      </div>
                      <div className='col-md-4 col-sm-4 col-xs-12'>
                        <div className='form-group'>
                          <label>BALANCE PIPES FOR COATING APPROX. (NOS.)</label>
                          <input
                            type='text'
                            value={10}
                            placeholder='BALANCE PIPES FOR COATING APPROX. (NOS.)'
                            style={{ cursor: 'not-allowed' }}
                            readOnly
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </section >
            <Footer />
          </>
      }
    </>
  );
}

export default Dailyproductionreport;
