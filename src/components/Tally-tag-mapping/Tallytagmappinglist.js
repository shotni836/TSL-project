import React, { useState, useEffect } from 'react';
import './Tallytagmappinglist.css';
import Header from '../Common/Header/Header';
import Footer from '../Common/Footer/Footer';
import Loading from '../Loading';
import InnerHeaderPageSection from "../../components/Common/Header-content/Header-content";
import { Link, useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { AgGridReact } from 'ag-grid-react';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Environment from "../../environment";
import axios from 'axios';
import secureLocalStorage from "react-secure-storage";
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';

function Tallytagmappinglist() {
  const userId = secureLocalStorage.getItem('userId');
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const menuId = queryParams.get('menuId');

  const [permissions, setPermissions] = useState({});
  const [data, setData] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clientFilter, setClientFilter] = useState('');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchPermissions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${Environment.BaseAPIURL}/api/User/GetPermissionDetailsByPageId`, {
          params: { UserId: userId, PageId: menuId }
        });
        const permissionsData = response.data[0] || {};
        setPermissions(permissionsData);
        if (permissionsData) {
          callMappingList();
        }
      } catch (error) {
        console.error('Error fetching permissions:', error);
        toast.error("Failed to fetch permissions");
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [userId, menuId]);

  const callMappingList = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${Environment.BaseAPIURL}/api/User/GetTallyTagMappingLists`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const filterData = (data) => {
    return data.filter(item => {
      const testDate = new Date(item.importDate);
      return (
        (!fromDate || testDate >= fromDate) &&
        (!toDate || testDate <= toDate) &&
        (!clientFilter || item.clientName === clientFilter) &&
        (!searchText || item.processSheetNo.toLowerCase().includes(searchText.toLowerCase()))
      );
    });
  };

  const resetFilter = () => {
    setFromDate(null);
    setToDate(null);
    setClientFilter('');
    setSearchText('');
  };

  const renderDropdownFilters = () => {
    const uniqueClients = [...new Set(data.map(item => item.clientName))];

    return (
      <>
        <div className="form-group">
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

  const handleDelete = async (row) => {
    confirmAlert({
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              const response = await axios.post(`${Environment.BaseAPIURL}/api/User/UpdatePipeDeleteStatus`, {
                tallySheetId: parseInt(row.tallySheetId, 10),
                pipeId: parseInt(row.pipeId, 10),
                pipeDeleteStatus: true
              });
              if (response.status === 200) {
                toast.success(response.data.responseMessage);
                callMappingList();
              } else {
                toast.error(response.data.responseMessage);
              }
            } catch (error) {
              console.error('Error deleting data:', error);
              toast.error("Failed to remove");
            }
          }
        },
        { label: 'No' }
      ]
    });
  };

  const columnDefs = [
    { headerName: 'S. No.', field: 'tallySheetId', width: 70, valueGetter: 'node.rowIndex + 1' },
    { headerName: 'Process Sheet No.', width: 220, field: 'processSheetNo' },
    { headerName: 'Client Name', width: 300, field: 'clientName' },
    { headerName: 'Tallysheet No.', field: 'tallySheetNo' },
    { headerName: 'Date', width: 130, field: 'importDate' },
    {
      headerName: 'Action',
      width: 130,
      cellRenderer: (params) => {
        const row = params.data;
        return (
          <div>
            {permissions?.indexPerm === "1" && (
              <Link id="listviewbutton" to={`/viewtallytagmapping?tallySheetId=${row.tallySheetId}`} target='_blank'>
                <i title="View" className="fas fa-eye" id="ListViewButton" style={{ cursor: 'pointer', marginRight: '10px', color: '#4caf50' }}></i>
              </Link>
            )}
            {permissions?.editPerm === "1" && (
              <Link to={`/edittallytagmapping?tallySheetId=${row.tallySheetId}`} target='_blank'>
                <i title="Edit" className="fas fa-edit" style={{ cursor: 'pointer', marginRight: '10px', color: '#ff9800' }}></i>
              </Link>
            )}
            {permissions?.deletePerm === "1" && (
              <i title="Delete" className="fas fa-trash-alt" onClick={() => handleDelete(row)} style={{ cursor: 'pointer', color: '#ff5252' }}></i>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <>
      {loading ? <Loading /> :
        <>
          <Header />
          <InnerHeaderPageSection
            linkTo="/ppcdashboard?moduleId=617"
            linkText="PPC Module"
            linkText2="Tally Tag Mapping List"
          />
          <section className='TallytagmappinglistPageSection'>
            <div className='container'>
              <div className='row'>
                <div className='col-md-12 col-sm-12 col-xs-12'>
                  <div className='TallytagmappinglistTables'>
                    <h4 className="FilterText"><i className="fas fa-filter"></i> Filter </h4>
                    <div className='tableheaderflex'>
                      <div className='tableheaderfilter'>
                        <form className='DateFilterBox'>
                          <div className='form-group'>
                            <label>From Date</label>
                            <DatePicker
                              maxDate={new Date()}
                              selected={fromDate}
                              onChange={(date) => setFromDate(date)}
                              dateFormat="dd-MM-yyyy"
                              placeholderText="DD-MM-YYYY"
                            />
                          </div>
                          <div className='form-group'>
                            <label>To Date</label>
                            <DatePicker
                              maxDate={new Date()}
                              selected={toDate}
                              onChange={(date) => setToDate(date)}
                              dateFormat="dd-MM-yyyy"
                              placeholderText="DD-MM-YYYY"
                            />
                          </div>
                          {renderDropdownFilters()}
                        </form>
                      </div>
                      <div className='tableheaderAddbutton'>
                        {permissions?.createPerm === "1" && (
                          <Link to={`/tallytagmapping?menuId=${menuId}`} target='_blank'>
                            <i className="fas fa-plus"></i> Add
                          </Link>
                        )}
                      </div>
                    </div>
                    <div className="fadedIcon">
                      <div className='ProcessSheetNoBox'>
                        <label htmlFor="">Search Process Sheet No.</label>
                        <input
                          type="text"
                          placeholder="Search by Process Sheet No."
                          value={searchText}
                          onChange={(e) => setSearchText(e.target.value)}
                        />
                      </div>
                      <ul>
                        <li><i className="fa-solid fa-eye" style={{ color: "#4caf50" }}></i>View</li>
                        <li><i className="fa-solid fa-edit" style={{ color: "#ff9800" }}></i>Edit</li>
                        <li><i className="fa-solid fa-trash-can" style={{ color: "#ff5252" }}></i>Delete</li>
                      </ul>
                    </div>
                    <div className="ag-theme-alpine">
                      <AgGridReact
                        columnDefs={columnDefs}
                        rowData={filterData(data)}
                        className='tallytagmappingListTable'
                        paginationPageSize={10}
                        pagination={true}
                        domLayout="autoHeight"
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
  );
}

export default Tallytagmappinglist;