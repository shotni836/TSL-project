import React from 'react'
import './App.css';
import { Route, Routes, BrowserRouter } from "react-router-dom";

// LOGIN PAGE
import Login from './components/Login/Login';
import ForgotPassword from './components/Login/Forgot-password';
import UpdatePassword from './components/Login/Update-password';

// MODULE PAGE
import Module from './components/Module/Module';

// PROFILE PAGE
import Profile from './components/Profile/Profile';
import UpdateProfile from './components/Update-profile-request/Update-profile-request';

// DASHBOARD PAGE
import Dashboard from './components/Dashboard/Dashboard';
import Hrdashboard from './components/Hr-dashboard/Hrdashboard';
import Ppcdashboard from './components/Ppc-dashboard/Ppcdashboard';
import Productiondashboard from './components/Production-dashboard/Productiondashboard';

// REGISTER EMPLOYEE PAGE
import Registeremployee from './components/Register-employee/Registeremployee';

import PeelTest from './components/Reports/Field-test/Peel-test'

// COMPLETE REGISTER PAGE
import Completeregister from './components/Complete-register-form/Completeregister';

// EMPLOYEE lIST PAGE
import Employeelist from './components/Employee-list/Employeelist';

// TALLY TAG MAPPING PAGE
import Tallytagmapping from './components/Tally-tag-mapping/Tallytagmapping';
import Tallytagmappinglist from './components/Tally-tag-mapping/Tallytagmappinglist';
import Viewtallytagmapping from './components/Tally-tag-mapping/Viewtallytagmapping';
import Edittallytagmapping from './components/Tally-tag-mapping/Edittallytagmapping'

// PROCESS SHEET PAGE
import Inlet from './components/Inlet/Inlet';
import Blasting from './components/Blasting/Blasting';
import Processsheet from './components/Process-sheet/Coating';
import ProcessSheetview from './components/Process-sheet-view/ProcessSheetview';
import Addstation from './components/Process-sheet/AddStation';
import Processsheetlist from './components/Process-sheet-list/ProcessSheetlist';
import BlastingDataEntry from './components/Blasting-Process-sheet/BlastingDataEntry';
import BlastingSheetlist from './components/Blasting-process-list/BlastingSheetlist';


import Pqt from './components/Reports/Pipe-release-mtc/Pqt/Pqt';
import Mtc from './components/Reports/Pipe-release-mtc/Mtc/Mtc';

// SUMIT
// import Processdataentrylevelapproved from './components/processdataentry-level-approved/Processdataentrylevelapproved';


// import Beforelabtestingapproved from './components/beforelab-testing-approved/Beforelabtestingapproved';
// END SUMIT

// import QCofficer from './components/Raw-material/QCofficer';
// import QCofficerlist from './components/Raw-material/QCofficerlist';
// import QCofficerapproved from './components/Raw-material/QCofficerapproved';
// import Tpilist from './components/Raw-material/Tpilist';
// import Tpi from './components/Raw-material/Tpi';
// import Tpiapproved from './components/Raw-material/Tpiapproved';

// APPLICATION TABLE PAGE
// import ApplicationTable from './components/Application-table/ApplicationTable';

// SAMPLE REPORT PAGE
import Sampleonereport from './components/Common/Sample-onereport/Sampleonereport';

// REPORT PAGE
import Reportlist from './components/Reportlist/Reportlist';
import Epoxyreport from './components/Reportlist/Epoxyreport';

import Formatlistview from './components/Format-List/Formatlistview';
import Formatlistedit from './components/Format-List/Formatlistedit';

// TESTING PAGE
import Testing from './components/Testing/Testing';

// External Origin Page
import Externalorigin from './components/External-origin/Externalorigin';
import Externaloriginlist from './components/External-origin/Externaloriginlist';
import Externaloriginview from './components/External-origin/Externaloriginview';
import Externaloriginedit from './components/External-origin/Externaloriginedit';

// Work Instruction Page
import Workinstruction from './components/Work-Instruction/Workinstruction';
import Workinstructionlist from './components/Work-Instruction/Workinstructionlist';
import Workinstructionview from './components/Work-Instruction/Workinstructionview';


import AssignLabFieldTestList from './components/AssignLabFieldTest/AssignLabFieldList';


// RAW MATERIAL PAGE

import Inspectiontesting from './components/Inspectiontesting/Inspectiontesting'

import RawMaterialInwardList from './components/Raw-material-list/Raw-material-inward';

import Rawmaterialinspection from './components/Raw-material-inspection/Rawmaterialinspection';

import RawmaterialList from './components/Raw-material-list/Rawmateriallist';

import InhouseTesting from './components/Raw-material/InhouseTesting';

import BeforeProcessLabTesting from './components/Raw-material/BeforeProcessLabTesting';

import LabTesting from './components/Raw-material/LabTesting';

import FieldTesting from './components/Raw-material/FieldTesting';

import Rawmaterial from './components/Raw-material/Rawmaterial';



// Calibration Page
import Calibration from './components/Calibration/Calibration';
import Calibrationlist from './components/Calibration/Calibrationlist';
import Calibrationedit from './components/Calibration/Calibrationedit';
import Calibrationview from './components/Calibration/Calibrationview';

// Format List Page
import Formatlist from './components/Format-List/Formatlist';
import Formatlistlist from './components/Format-List/Formatlistlist';



import List from './components/Reports/List';
// Raw-Material-Inspection Report
import InspectionReport from './components/Reports/Raw-material-inspection/Inspection-report';
// Raw-Material-In-House-Testing
import InHouseTestReport from './components/Reports/Raw-material-in-house-test/In-house-report';
// Before-Process-LAB-Testing
import BeforeProcessLabTestReport from './components/Reports/Before-process-lab-test/Before-process-lab-test';
// import BeforeProcessLabTestReport1 from './components/Reports/Before-process-lab-test/Before-Process-lab-test1';
// CD-Test
import CdTest from './components/Reports/Cd-test/Cd-test';
import PorosityTest from './components/Reports/Cd-test/Porosity-test';
// Sec-LAB-Test
// import LabTest1 from './components/Reports/Lab-test/Lab-test-1';
// import LabTest2 from './components/Reports/Lab-test/Lab-test-2';
// import LabTest3 from './components/Reports/Lab-test/Lab-test-3';

import MiscList from './components/Reports/Misclist';
// Field-test
import FieldTest from './components/Reports/Field-test/Field-test';
import ChromCoatInsp from './components/Reports/Pipe-release-mtc/Chromate-coat-insp/Chromate-coat-insp';


// NEW REPORT
// import Newreport from './components/New-report/Newreport';

// Inlet , Blasting , Application , Thickness , External Final
import InletReport from './components/Reports/Pipe-release-mtc/Bare-pipe-insp/Bare-pipe-insp';
import RoghnessGauge from './components/Reports/Pipe-release-mtc/Roughness-gauge/Roughness-gauge';
// import DustLevel from './components/Reports/Pipe-release-mtc/Dust-level/Dust-level';
import PhosBlastInsp from './components/Reports/Pipe-release-mtc/Phosp-blast-insp/Phos-blast-insp';
// import ChromCoatInsp from './components/Reports/Pipe-release-mtc/Chromate-coat-insp/InspReport';
import ThicknessGauge from './components/Reports/Pipe-release-mtc/Thickness-gauge/Thickness-gauge';
import ThicknessInsp from './components/Reports/Pipe-release-mtc/Thickness-insp/Thickness-insp';
import FinalInsp from './components/Reports/Pipe-release-mtc/Final-inspection/Final-insp';
import HolidayCallib from './components/Reports/Pipe-release-mtc/Holiday-callibration/Holiday-calibration';
import NcReport from './components/Reports/Pipe-release-mtc/Nc-report/Nc-report';

// Before Process Lab Testing
// import Beforeprocesslabtesting from './components/Before-process-lab-testing/Beforeprocesslabtesting';
// import Beforeprocesslabtestinglist from './components/Before-process-lab-testing/Beforeprocesslabtestinglist';
// import Beforeprocesslabqcofficerlist from './components/Before-process-lab-testing/Beforeprocesslabqcofficerlist';
// import Beforeprocesslabqcofficerapproved from './components/Before-process-lab-testing/Beforeprocesslabqcofficerapproved';
// import Beforeprocesslabqcofficer from './components/Before-process-lab-testing/Beforeprocesslabqcofficer';
// import Beforeprocesslabtestingtpi from './components/Before-process-lab-testing/Beforeprocesslabtestingtpi';
// import Beforeprocesslabtestingtpiapproved from './components/Before-process-lab-testing/Beforeprocesslabtestingtpiapproved';
// import Beforeprocesslabtestingtpilist from './components/Before-process-lab-testing/Beforeprocesslabtestingtpilist';
// import Beforeprocesslabtestingview from './components/Before-process-lab-testing/Beforeprocesslabtestingview';

import Dustlevel from './components/Reports/Pipe-release-mtc/Dust-level/Dustlevel';
import Dustlevelview from './components/Reports/Pipe-release-mtc/Dust-level/Dustlevelview';
import DustList from './components/Reports/Pipe-release-mtc/Dust-level/Dustlist';

// In Process Lab Testing
// import Inprocesslab from './components/In-process-lab-testing/Inprocesslab';
// import Inprocesslablist from './components/In-process-lab-testing/Inprocesslablist';
// import Inprocesslabqcofficerlist from './components/In-process-lab-testing/Inprocesslabqcofficerlist';
// import Inprocesslabqcofficerapproved from './components/In-process-lab-testing/Inprocesslabqcofficerapproved';
// import Inprocesslabqcofficer from './components/In-process-lab-testing/Inprocesslabqcofficer';
// import Inprocesslabtpi from './components/In-process-lab-testing/Inprocesslabtpi';
// import Inprocesslabtpiapproved from './components/In-process-lab-testing/Inprocesslabtpiapproved';
// import Inprocesslabtpilist from './components/In-process-lab-testing/Inprocesslabtpilist';
// import Inprocesslabview from './components/In-process-lab-testing/Inprocesslabview';

// In Process Field Testing
// import Inprocessfield from './components/In-process-field-testing/Inprocessfield';
// import Inprocessfieldlist from './components/In-process-field-testing/Inprocessfieldlist';
// import Inprocessfieldqcofficerlist from './components/In-process-field-testing/Inprocessfieldqcofficerlist';
// import Inprocessfieldqcofficerapproved from './components/In-process-field-testing/Inprocessfieldqcofficerapproved';
// import Inprocessfieldqcofficer from './components/In-process-field-testing/Inprocessfieldqcofficer';
// import Inprocessfieldtpi from './components/In-process-field-testing/Inprocessfieldtpi';
// import Inprocessfieldtpiapproved from './components/In-process-field-testing/Inprocessfieldtpiapproved';
// import Inprocessfieldtpilist from './components/In-process-field-testing/Inprocessfieldtpilist';
// import Inprocessfieldview from './components/In-process-field-testing/Inprocessfieldview';
import AssignLabFieldTest from './components/AssignLabFieldTest/AssignLabFieldTest';


// Blasting Line
import AddBlastingline from './components/Blasting-line/AddBlastingline';
import ListBlastingline from './components/Blasting-line/ListBlastingline';
import ViewBlastingline from './components/Blasting-line/ViewBlastingline';

// Coating Application Line
import Addcoatingapplicationline from './components/Coatingapplication-line/Addcoatingapplicationline';
import Listcoatingapplicationline from './components/Coatingapplication-line/Listcoatingapplicationline';
import Viewcoatingapplicationline from './components/Coatingapplication-line/Viewcoatingapplicationline';

// Blasting Line
// import Addproductionparameterchart from './components/Blasting-line/AddBlastingline';
// import Listproductionparameterchart from './components/Blasting-line/ListBlastingline';
// import Viewproductionparameterchart from './components/Blasting-line/ViewBlastingline';

import Masters from './components/Masters/Masters';
import Masterslist from './components/Masters/Masterslist';

// // Coating Application Line
// import Addcoatingapplicationline from './components/Coatingapplication-line/Addcoatingapplicationline';
// import Listcoatingapplicationline from './components/Coatingapplication-line/Listcoatingapplicationline';
// import Viewcoatingapplicationline from './components/Coatingapplication-line/Viewcoatingapplicationline';

// Role
import Role from './components/Role/Role';
import RawMaterialList from './components/Raw-material-list/Raw-material-inward';


import Dailyproductionreport from './components/Daily-production-report/Dailyproductionreport';
import Dailyproductionreportedit from './components/Daily-production-report/Dailyproductionreportedit';
import Dailyproductionreportlist from './components/Daily-production-report/Dailyproductionreportlist';
import Dailyproductionreportview from './components/Daily-production-report/Dailyproductionreportview';
import CalibrationBlasting from './components/Reports/Calibration-reports/CalibrationBlasting';
import CalibrationBlastingReport from './components/Reports/Calibration-reports/CalibrationBlastingReport';

// Indentation Test
import IndentationTest from './components/Reports/Cd-test/Indentation';
import BlastingDataEntryInlet from './components/Blasting-Process-sheet/BlastingDataEntryInlet';
import BlastingDataEntryBlasting from './components/Blasting-Process-sheet/BlastingDataEntryBlasting';
import Repair from './components/Reports/Repair/Repair';
import RepairList from './components/Reports/Repair/RepairList';
import RepairReport from './components/Reports/Repair/RepairReport';


// UNUSED PAGE
// import Viewmodifyform from './components/View-modify-form/Viewmodifyform';

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>

          {/* LOGIN PAGE */}
          <Route path="/" element={<Login />} ></Route>
          <Route path="/forgotPassword" element={<ForgotPassword />} ></Route>
          <Route path="/updatePassword" element={<UpdatePassword />} ></Route>

          {/* MODULE PAGE */}
          <Route path="/module" element={<Module />} ></Route>

          {/* PROFILE PAGE */}
          <Route path="/profile" element={<Profile />} ></Route>

          {/* UPDATE PROFILE  */}
          <Route path="/updateProfile" element={<UpdateProfile />} ></Route>

          <Route path="/peel-test/:tstmaterialid" element={<PeelTest />} ></Route>

          {/* DASHBOARD PAGE */}
          <Route path="/dashboard" element={<Dashboard />} ></Route>
          <Route path="/hrdashboard" element={<Hrdashboard />} ></Route>
          <Route path="/ppcdashboard" element={<Ppcdashboard />} ></Route>
          <Route path="/productiondashboard" element={<Productiondashboard />} ></Route>

          <Route path="/chromate-coat-insp/:tstmaterialid" element={<ChromCoatInsp />} ></Route>

          {/* REGISTER EMPLOYEE PAGE */}
          <Route path="/registeremployee" element={<Registeremployee />} ></Route>

          <Route path="/calibration-blasting-report" element={<CalibrationBlasting />} ></Route>
          <Route path="/calibration-blasting-report-view/:tstmaterialid" element={<CalibrationBlastingReport />} ></Route>

          {/* COMPLETE REGISTER PAGE */}
          <Route path="/completeregister" element={<Completeregister />} ></Route>

          <Route path="/dustlevel/:tstmaterialid" element={<Dustlevel />} ></Route>
          <Route path="/dustlevelview/:tstmaterialid" element={<Dustlevelview />} ></Route>
          <Route path="/dustlist" element={<DustList />} ></Route>

          {/* EMPLOYEE lIST PAGE */}
          <Route path="/employeelist" element={<Employeelist />} ></Route>
          <Route path='/list/miseleaneous-test' element={<MiscList />}></Route>

          {/* TALLY TAG MAPPING PAGE */}
          <Route path="/tallytagmapping" element={<Tallytagmapping />} ></Route>
          <Route path="/tallytagmappinglist" element={<Tallytagmappinglist />} ></Route>
          <Route path="/viewtallytagmapping" element={<Viewtallytagmapping />} ></Route>
          <Route path="/edittallytagmapping" element={<Edittallytagmapping />}></Route>

          {/* RAW MATERIAL PAGE */}
          <Route path="/inspectiontesting" element={<Inspectiontesting />} ></Route>
          <Route path="/rawmaterial" element={<Rawmaterial />} ></Route>

          <Route path="/rawmaterialinwardlist" element={<RawMaterialInwardList />} ></Route>
          <Route path="/rawmaterialinspection" element={<Rawmaterialinspection />} ></Route>

          <Route path="/rawmateriallist" element={<RawmaterialList />} ></Route>

          <Route path="/inhousetest" element={<InhouseTesting />} ></Route>

          <Route path="/beforeprocesslabtest" element={<BeforeProcessLabTesting />} ></Route>

          <Route path="/labtest" element={<LabTesting />} ></Route>

          <Route path="/fieldtest" element={<FieldTesting />} ></Route>

          {/* PROCESS SHEET PAGE */}
          <Route path="/inlet" element={<Inlet />} ></Route>
          <Route path="/blasting" element={<Blasting />} ></Route>
          <Route path="/coating" element={<Processsheet />} ></Route>
          <Route path="/addstation" element={<Addstation />} ></Route>
          <Route path="/processsheetlist" element={<Processsheetlist />} ></Route>
          <Route path="/processsheetview" element={<ProcessSheetview />} ></Route>
          <Route path="/blastingprocesssheet" element={<BlastingDataEntry />} ></Route>
          <Route path="/blastingprocesssheetInlet" element={<BlastingDataEntryInlet />} ></Route>
          <Route path="/blastingprocesssheetBlasting" element={<BlastingDataEntryBlasting />} ></Route>
          <Route path="/blastingsheetlist" element={<BlastingSheetlist />} ></Route>
          <Route path="/pqt" element={<Pqt />} ></Route>
          <Route path="/mtc" element={<Mtc />} ></Route>
          {/* SUMIT */}
          {/* <Route path="/processdataentrylevelapproved" element={<Processdataentrylevelapproved />} ></Route> */}

          {/* BLASTING LINE PAGE */}
          <Route path="/addblastingline" element={<AddBlastingline />} ></Route>
          <Route path="/listblastingline" element={<ListBlastingline />} ></Route>
          <Route path="/viewblastingline" element={<ViewBlastingline />} ></Route>

          {/* <Route path="/beforelabtestingapproved" element={<Beforelabtestingapproved />} ></Route> */}
          {/* END SUMIT */}
          {/* <Route path="/qcofficer" element={<QCofficer />} ></Route>
          <Route path="/qcofficerlist" element={<QCofficerlist />} ></Route>
          <Route path="/qcofficerapproved" element={<QCofficerapproved />} ></Route>
          <Route path="/tpilist" element={<Tpilist />} ></Route>
          <Route path="/tpi" element={<Tpi />} ></Route>
          <Route path="/tpiapproved" element={<Tpiapproved />} ></Route> */}

          {/* APPLICATION TABLE PAGE */}
          {/* <Route path="/applicationtable" element={<ApplicationTable />} ></Route> */}

          {/* SAMPLE REPORT PAGE */}
          <Route path="/Sampleonereport" element={<Sampleonereport />} ></Route>

          {/* TESTING PAGE */}
          <Route path="/testing" element={<Testing />} ></Route>

          {/* REPORT PAGE */}
          <Route path="/reportlist" element={<Reportlist />} ></Route>
          <Route path="/epoxyreport" element={<Epoxyreport />} ></Route>

          {/* External Origin Page */}
          <Route path="/externalorigin" element={<Externalorigin />} ></Route>
          <Route path="/externaloriginlist" element={<Externaloriginlist />} ></Route>
          <Route path="/externaloriginview" element={<Externaloriginview />} ></Route>
          <Route path="/externaloriginedit" element={<Externaloriginedit />} ></Route>


          {/* Work Instruction Page */}
          <Route path="/Workinstruction" element={<Workinstruction />} ></Route>
          <Route path="/Workinstructionlist" element={<Workinstructionlist />} ></Route>
          <Route path="/Workinstructionview" element={<Workinstructionview />} ></Route>

          {/*Calibration Page */}
          <Route path="/Calibration" element={<Calibration />} ></Route>
          <Route path="/Calibrationlist" element={<Calibrationlist />} ></Route>
          <Route path="/Calibrationedit" element={<Calibrationedit />} ></Route>
          <Route path="/Calibrationview" element={<Calibrationview />} ></Route>

          {/* Repair Module */}
          <Route path="/repair-add" element={<Repair />} ></Route>
          <Route path="/repair-list" element={<RepairList />} ></Route>
          <Route path="/repair-report/:tstmaterialid" element={<RepairReport />} ></Route>

          {/* Format List Page */}
          <Route path="/Formatlist" element={<Formatlist />} ></Route>
          <Route path="/Formatlistlist" element={<Formatlistlist />} ></Route>
          <Route path="/formatlistview" element={<Formatlistview />} ></Route>
          <Route path="/Formatlistedit" element={<Formatlistedit />} ></Route>

          <Route path='/list/:routePrefix/:tstmaterialid' element={<List />}></Route>
          {/* Raw Material Inspection */}
          <Route path="/inspection-test/:tstmaterialid" element={<InspectionReport />} ></Route>
          {/* <Route path="/rawmaterialInspView" element={<RawmaterialInspView />}></Route> */}

          {/* Raw Material In House Testing */}
          <Route path="/in-house-test/:tstmaterialid" element={<InHouseTestReport />} ></Route>

          {/* Before-Process-LAB-Testing */}
          <Route path="/before-process-lab-test/:tstmaterialid" element={<BeforeProcessLabTestReport />} ></Route>
          {/* <Route path="/before-process-lab-test1/:tstmaterialid" element={<BeforeProcessLabTestReport1 />} ></Route> */}

          {/* TESTING PAGE */}
          <Route path="/testing" element={<Testing />} ></Route>

          {/* CD-Test */}
          <Route path="/cd-test/:tstmaterialid" element={<CdTest />} ></Route>
          <Route path="/porosity-test/:tstmaterialid" element={<PorosityTest />} ></Route>

          {/* Lab-test */}
          {/* <Route path="/lab-test-1/:tstmaterialid" element={<LabTest1 />} ></Route>
          <Route path="/lab-test-2/:tstmaterialid" element={<LabTest2 />} ></Route>
          <Route path="/lab-test-3/:tstmaterialid" element={<LabTest3 />} ></Route> */}

          {/* Field-test */}
          <Route path="/field-test/:tstmaterialid" element={<FieldTest />} ></Route>

          {/* Inlet , Blasting , Application , Thickness , External Final */}
          <Route path="/bare-pipe-inspection/:tstmaterialid" element={<InletReport />} ></Route>
          <Route path="/rough-gauge/:tstmaterialid" element={<RoghnessGauge />} ></Route>
          {/* <Route path="/dust-level" element={<DustLevel />} ></Route> */}
          <Route path="/phos-blast-insp/:tstmaterialid" element={<PhosBlastInsp />} ></Route>
          <Route path="/pipe-release-mtc-test/:tstmaterialid" element={<ChromCoatInsp />} ></Route>
          <Route path="/thickness-gauge/:tstmaterialid" element={<ThicknessGauge />} ></Route>
          <Route path="/thickness-insp/:tstmaterialid" element={<ThicknessInsp />} ></Route>
          <Route path="/final-inspection/:tstmaterialid" element={<FinalInsp />} ></Route>
          <Route path="/holiday-calib/:tstmaterialid" element={<HolidayCallib />} ></Route>
          <Route path="/nc-report/:tstmaterialid" element={<NcReport />} ></Route>
          {/* <Route path="/production" element={<Production />} ></Route> */}

          {/* MASTERS PAGE */}
          <Route path="/masters" element={<Masters />} ></Route>
          <Route path="/masterslist" element={<Masterslist />} ></Route>

          {/* Before Process Lab Testing */}
          {/* <Route path="/beforeprocesslabtesting" element={<Beforeprocesslabtesting />} ></Route>
          <Route path="/beforeprocesslabtestinglist" element={<Beforeprocesslabtestinglist />} ></Route>
          <Route path="/beforeprocesslabqcofficerlist" element={<Beforeprocesslabqcofficerlist />} ></Route>
          <Route path="/beforeprocesslabqcofficerapproved" element={<Beforeprocesslabqcofficerapproved />} ></Route>
          <Route path="/Beforeprocesslabqcofficer" element={<Beforeprocesslabqcofficer />} ></Route>
          <Route path="/beforeprocesslabtestingtpi" element={<Beforeprocesslabtestingtpi />} ></Route>
          <Route path="/beforeprocesslabtestingtpiapproved" element={<Beforeprocesslabtestingtpiapproved />} ></Route>
          <Route path="/beforeprocesslabtestingtpilist" element={<Beforeprocesslabtestingtpilist />} ></Route>
          <Route path="/beforeprocesslabtestingview" element={<Beforeprocesslabtestingview />} ></Route> */}

          {/* In Process Lab Testing */}
          {/* <Route path="/Inprocesslab" element={<Inprocesslab />} ></Route>
          <Route path="/Inprocesslablist" element={<Inprocesslablist />} ></Route>
          <Route path="/Inprocesslabqcofficerlist" element={<Inprocesslabqcofficerlist />} ></Route>
          <Route path="/Inprocesslabqcofficerapproved" element={<Inprocesslabqcofficerapproved />} ></Route>
          <Route path="/Inprocesslabqcofficer" element={<Inprocesslabqcofficer />} ></Route>
          <Route path="/Inprocesslabtpi" element={<Inprocesslabtpi />} ></Route>
          <Route path="/Inprocesslabtpiapproved" element={<Inprocesslabtpiapproved />} ></Route>
          <Route path="/Inprocesslabtpilist" element={<Inprocesslabtpilist />} ></Route>
          <Route path="/Inprocesslabview" element={<Inprocesslabview />} ></Route> */}

          {/* NEW REPORT */}
          {/* <Route path="/newreport" element={<Newreport />} ></Route> */}

          {/* In Process Field Testing */}
          {/* <Route path="/Inprocessfield" element={<Inprocessfield />} ></Route>
          <Route path="/Inprocessfieldlist" element={<Inprocessfieldlist />} ></Route>
          <Route path="/Inprocessfieldqcofficerlist" element={<Inprocessfieldqcofficerlist />} ></Route>
          <Route path="/Inprocessfieldqcofficerapproved" element={<Inprocessfieldqcofficerapproved />} ></Route>
          <Route path="/Inprocessfieldqcofficer" element={<Inprocessfieldqcofficer />} ></Route>
          <Route path="/Inprocessfieldtpi" element={<Inprocessfieldtpi />} ></Route>
          <Route path="/Inprocessfieldtpiapproved" element={<Inprocessfieldtpiapproved />} ></Route>
          <Route path="/Inprocessfieldtpilist" element={<Inprocessfieldtpilist />} ></Route>
          <Route path="/Inprocessfieldview" element={<Inprocessfieldview />} ></Route> */}

          {/* BLASTING LINE PAGE */}
          {/* <Route path="/addproductionparameterchart" element={<Addproductionparameterchart />} ></Route>
          <Route path="/listproductionparameterchart" element={<Listproductionparameterchart />} ></Route>
          <Route path="/viewproductionparameterchart" element={<Viewproductionparameterchart />} ></Route> */}

          {/* COATING APPLICATION LINE PAGE */}
          <Route path="/addcoatingapplicationline" element={<Addcoatingapplicationline />} ></Route>
          <Route path="/listcoatingapplicationline" element={<Listcoatingapplicationline />} ></Route>
          <Route path="/viewcoatingapplicationline" element={<Viewcoatingapplicationline />} ></Route>

          {/* ROLE PAGE */}
          <Route path="/role" element={<Role />} ></Route>
          <Route path="/assignfieldlabtest" element={<AssignLabFieldTest />} ></Route>
          <Route path="/assignfieldlabtestlist" element={<AssignLabFieldTestList />} ></Route>

          {/* UNUSED PAGE */}
          {/* <Route path = "/viewmodifyform" element = {<Viewmodifyform />} ></Route> */}

          <Route path="/dailyproductionreport" element={<Dailyproductionreport />} ></Route>
          <Route path="/dailyproductionreportview" element={<Dailyproductionreportview />} ></Route>
          <Route path="/dailyproductionreportlist" element={<Dailyproductionreportlist />} ></Route>
          <Route path="/dailyproductionreportedit" element={<Dailyproductionreportedit />} ></Route>

          {/* Indentation Report */}
          <Route path="/indentation-test/:tstmaterialid" element={<IndentationTest />} ></Route>


        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App