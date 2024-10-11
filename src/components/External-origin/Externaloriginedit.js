import React, { useState, useEffect } from 'react';
import './Externalorigin.css'

import Loading from '../Loading';
import RegisterEmployeebg from '../../assets/images/RegisterEmployeebg.jpg';
import { Link } from 'react-router-dom';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import Header from '../Common/Header/Header'
import Footer from '../Common/Footer/Footer'


function Externaloriginedit() {

  const [selectedValue, setSelectedValue] = useState(6);

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const options = Array.from({ length: 100 }, (_, index) => index + 1);

  // --------------------------------------------------------------------

  const [selectedDate, setSelectedDate] = useState(null);

  // --------------------------------------------------------------------

  const currentYear = new Date().getFullYear();
  const startYear = 1969;
  const endYear = currentYear + 2;

  const years = Array.from({ length: endYear - startYear }, (_, index) => startYear + index).reverse();

  const [selectedYear, setSelectedYear] = useState(currentYear);

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  // --------------------------------------------------------------------

  const reaffirmedcurrentYear = new Date().getFullYear();
  const reaffirmedstartYear = 1969;
  const reaffirmedendYear = reaffirmedcurrentYear + 2;

  const reaffirmedyears = Array.from({ length: reaffirmedendYear - reaffirmedstartYear }, (_, index) => reaffirmedstartYear + index).reverse();

  const [reaffirmedselectedYear, setreaffirmedSelectedYear] = useState(reaffirmedcurrentYear);

  const reaffirmedhandleYearChange = (e) => {
    setreaffirmedSelectedYear(parseInt(e.target.value));
  };

  // --------------------------------------------------------------------

  const [data, setData] = useState([
    { id: 1, location: 'New Delhi' },
    // Add more initial data as needed
  ]);

  const addTableRow = () => {
    const newRow = {
      id: data.length + 1,
      location: 'New Delhi'
    };

    setData([...data, newRow]);
  };

  const deleteTableRow = (id) => {
    const updatedData = data.filter((row) => row.id !== id);
    setData(updatedData);
  };

  // --------------------------------------------------------------------

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 1000);
  }, [])

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
                      <li> <Link to='/dashboard?moduleId=618'> Quality Module </Link></li>
                      <li><b style={{ color: '#fff' }}>/&nbsp;</b> <Link to={`/externaloriginlist?menuId=32`}> External Origin List</Link></li>
                      <li><h1> / &nbsp; External Origin Edit </h1></li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className='ExternaloriginSectionPage ExternaloriginEditSectionPage'>
              <div className='container'>
                <div className='row'>
                  <div className='col-md-12 col-sm-12 col-xs-12'>
                    <div className='ExternaloriginListBox'>
                      <h4>External Origin <span>- Edit Page</span></h4>
                      <div className='ExternaloriginTable' id='custom-scroll'>
                        <table>
                          <thead>
                            <tr style={{ background: 'rgb(90, 36, 90)' }}>
                              <th style={{ minWidth: '60px' }}>S No.</th>
                              <th style={{ minWidth: '160px' }}>Standard / Specification</th>
                              <th style={{ minWidth: '400px' }}>Document Description</th>
                              <th style={{ minWidth: '100px' }}>Revision No.</th>
                              <th style={{ minWidth: '110px' }}>Revision Date</th>
                              <th style={{ minWidth: '120px' }}>Publication Year</th>
                              <th style={{ minWidth: '120px' }}>Reaffirmed Year</th>
                              <th style={{ minWidth: '100px' }}>Location</th>
                              <th style={{ minWidth: '150px' }}>Document Type</th>
                              <th style={{ minWidth: '100px' }}>Item Type</th>
                              <th style={{ minWidth: '380px' }}>Path</th>
                            </tr>
                          </thead>

                          <tbody>
                            {data.map((row) => (
                              <tr key={row.id}>
                                <td>{row.id}</td>
                                <td><input type="text" placeholder='API Spec Q1' /></td>
                                <td><textarea name="" placeholder='Specification for Quality Management System Requirements for Manufacturing Organizations for the Petroleum and Natural Gas Industry, Tenth Edition'></textarea></td>
                                <td>
                                  <select id="number" value={selectedValue} onChange={handleChange}>
                                    <option value="">-</option>
                                    {options.map((number) => (
                                      <option key={number} value={number}>
                                        {number}
                                      </option>
                                    ))}
                                  </select>
                                </td>
                                <td>
                                  <DatePicker
                                    maxDate={Date.now()}
                                    selected={selectedDate}
                                    onChange={(date) => setSelectedDate(date)}
                                    dateFormat="dd/MMM/yyyy"
                                    placeholderText="23/01/2024"
                                  />
                                </td>
                                <td>
                                  <select id="yearDropdown" onChange={handleYearChange}>
                                    <option value="">-</option>
                                    {years.map((year) => (
                                      <option key={year} value={year}>
                                        {year}
                                      </option>
                                    ))}
                                  </select>
                                </td>
                                <td>
                                  <select id="yearDropdown" value={reaffirmedselectedYear} onChange={reaffirmedhandleYearChange}>
                                    <option value="">-</option>
                                    {reaffirmedyears.map((year) => (
                                      <option key={year} value={year}>
                                        {year}
                                      </option>
                                    ))}
                                  </select>
                                </td>
                                <td>
                                  <input type="text" placeholder='Enter location' />
                                </td>
                                <td>
                                  <div className='Doctypeflex'>
                                    <label for="hardradio">
                                      <input type="radio" id="hardradio" name="doctype" value="Hardradio" /> Hard
                                    </label>

                                    <label for="softradio">
                                      <input type="radio" id="softradio" name="doctype" value="Softradio" checked /> Soft
                                    </label>
                                  </div>
                                </td>
                                <td>
                                  <div className='Doctypeflex'>
                                    <label for="itemradio">
                                      <input type="radio" id="itemradio" name='item' value="Itemradio" checked />Item
                                    </label>
                                  </div>
                                </td>
                                <td>
                                  <select name="" id="">
                                    <option value="">-</option>
                                    <option value="" selected>sites/ldpcoatingdatashare/Lists/LDP External Origin</option>
                                  </select>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="SubmitFlexBx">
                        <Link to='/externaloriginlist'>Update</Link>
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

export default Externaloriginedit