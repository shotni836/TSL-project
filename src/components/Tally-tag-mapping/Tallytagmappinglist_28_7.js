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
import 'react-confirm-alert/src/react-confirm-alert.css';

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

  useEffect(() => {
    const fetchPermissions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${Environment.BaseAPIURL}/api/User/GetPermissionDetailsByPageId`, {
          params: { UserId: userId, PageId: menuId }
        });
        setPermissions(response.data[0] || {});
        if (response.data[0]) {
          callMappingList();
        }
      } catch (error) {
        console.error('Error fetching permissions:', error);
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
    } finally {
      setLoading(false);
    }
  };

  const filterData = () => {
    if (!fromDate && !toDate) return data;
    return data.filter(item => {
      const testDate = new Date(item.importDate);
      return (!fromDate || testDate >= fromDate) && (!toDate || testDate <= toDate);
    });
  };

  const handleDelete = async (data) => {
    const { tallySheetId, pipeId } = data;

    confirmAlert({
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              const response = await axios.post(`${Environment.BaseAPIURL}/api/User/UpdatePipeDleteStatus`, {
                tallySheetId: parseInt(tallySheetId),
                pipeId: parseInt(pipeId),
                pipeDeleteStatus: true
              });
              if (response.status === 200) {
                console.log('Deleted:', data);
                toast.success(response.data.responseMessage);
                callMappingList();
              } else {
                console.error('Error deleting data:', response.data.responseMessage);
                toast.error(response.data.responseMessage);
              }
            } catch (error) {
              console.error('Error deleting data:', error);
              toast.error("Failed to remove")
            }
          }
        },
        { label: 'No' }
      ]
    });
  };

  const columnDefs = [
    {
      headerName: 'S. No.', field: 'tallySheetId',
      width: 70,
      valueGetter: 'node.rowIndex + 1',
    },
    { headerName: 'Client Name', width: 250, field: 'clientName' },
    { headerName: 'Process Sheet No.', width: 300, field: 'processSheetNo' },
    { headerName: 'Tallysheet No.', field: 'tallySheetNo' },
    {
      headerName: 'Date',
      width: 130,
      field: 'importDate',
      // valueGetter: params => {
      // if (params.data.importDate) {
      // Parse the date string into a Date object
      // const date = new Date(params.data.importDate);

      // Extract components
      // const day = date.getDate(); // Get day (1-31)
      // const month = date.getMonth() + 1; // Get month (0-11), add 1 for 1-12
      // const year = date.getFullYear(); // Get full year (YYYY)

      // Format into MM/DD/YYYY format
      // const formattedDate = `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;

      // return formattedDate;
      // const newDateFormat = params.data.importDate.split(' ')[0].replace("/", "-");
      // const [day, month, year] = newDateFormat.split('-');
      // return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
      // }
      //   return '';
      // },
    },
    {
      headerName: 'Action',
      width: 130,
      field: '',
      cellRenderer: (params) => {
        const row = params.data;
        return (
          <div>
            {permissions?.indexPerm === "1" && (
              <Link id="listviewbutton" to={`/viewtallytagmapping?tallySheetId=${row.tallySheetId}`} target='_blank'>
                <i className="fas fa-eye" id="ListViewButton" style={{ cursor: 'pointer', marginRight: '10px', color: 'green' }}></i>
              </Link>
            )}
            {permissions?.editPerm === "1" && (
              <Link to={`/edittallytagmapping?tallySheetId=${row.tallySheetId}`} target='_blank'>
                <i className="fas fa-edit" style={{ cursor: 'pointer', marginRight: '10px', color: 'black' }}></i>
              </Link>
            )}
            {permissions?.deletePerm === "1" && (
              <i className="fas fa-trash-alt" onClick={() => handleDelete(row)} style={{ cursor: 'pointer', color: 'red' }}></i>
            )}
          </div>
        );
      }
    }
  ];

  const handleResetDates = () => {
    setFromDate(null);
    setToDate(null);
  };

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
                    <h4>Tally Tag Mapping <span>- List page</span></h4>
                    <div className='tableheaderflex'>
                      <div className='tableheaderfilter'>
                        <span><i className="fas fa-filter"></i> Filter</span>
                        <label> From Date:
                          <DatePicker
                            maxDate={new Date()}
                            selected={fromDate}
                            onChange={(date) => setFromDate(date)}
                            dateFormat="MM-dd-yyyy"
                            placeholderText="DD-MM-YYYY"
                          />
                        </label>
                        <label> To Date:
                          <DatePicker
                            maxDate={new Date()}
                            selected={toDate}
                            onChange={(date) => setToDate(date)}
                            dateFormat="MM-dd-yyyy"
                            placeholderText="DD-MM-YYYY"
                          />
                        </label>
                        <i className='fa fa-refresh' onClick={handleResetDates}></i>
                      </div>
                      <div className='tableheaderAddbutton'>
                        {permissions?.createPerm === "1" && (
                          <Link to={`/tallytagmapping?menuId=${menuId}`} target='_blank'><i className="fas fa-plus"></i> Add</Link>
                        )}
                      </div>
                    </div>
                    <div className="ag-theme-alpine">
                      <AgGridReact
                        columnDefs={columnDefs}
                        rowData={filterData()}
                        suppressDragLeaveHidesColumns="true"
                        className='tallytagmappingListTable'
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