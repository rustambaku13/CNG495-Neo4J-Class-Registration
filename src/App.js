import React, { useState } from 'react';
import './App.css';
import 'antd/dist/antd.css';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import Navbar from './componenets/Navbar';
import AboutMeStudent from './componenets/AboutMeStudent';
import AboutMeStaff from './componenets/AboutMeStaff';
import {Modal,Form,Input,PageHeader,Menu,Dropdown,Button, Tabs,Row,Col} from 'antd';
import neo4j from 'neo4j-driver';
import LoginModal from './componenets/LoginModal';
import TakenCourses from './componenets/TakenCourses';
import RegisterCourses from './componenets/RegisterCourses';
import AllCoursesPage from './componenets/AllCoursesPage';
const driver = neo4j.driver(
  'neo4j://localhost'  
)
let session = driver.session({ defaultAccessMode: neo4j.session.READ,database: 'neo4j', }); 
function App() {  
  const [signin,setsignin] = useState(false);
  const [me,setMe] = useState(null)
  const [tab,setTab] = useState("passed_courses")
  const menu = (    <Menu onClick={(e)=>{setTab(e.key)}}>
      <Menu.Item key="about_me">
        <UserOutlined />
        About Me
      </Menu.Item>
      <Menu.Item key="passed_courses">
        <UserOutlined />
        Passed Courses
      </Menu.Item>
      <Menu.Item key="register_courses">
        <UserOutlined />
        Register Courses
      </Menu.Item>
    </Menu>);

  const menustaff = (    <Menu onClick={(e)=>{setTab(e.key)}}>
  <Menu.Item key="about_me">
    <UserOutlined />
    About Me
  </Menu.Item>
  <Menu.Item key="all_courses">
    <UserOutlined />
    Course List
  </Menu.Item>
 
  </Menu>);
  
  if(me){
    
    if(me.labels.includes("Student")){      
      return( <>
        <Navbar logout={()=>{setMe(null)}} logged_in={true} setsignin={setsignin}/>
        <PageHeader extra={[<Dropdown  overlay={menu}><Button>Actions <DownOutlined /></Button></Dropdown>]} className="site-page-header" title={`Welcome Student `} subTitle={`${me.properties.first_name} ${me.properties.last_name}`}/>,    
        <Row>
            <Col lg={{span:18,offset:3}}>
              {tab=="about_me"?<AboutMeStudent me={me}/>:tab=="passed_courses"?<TakenCourses session={session} me={me}/>:<RegisterCourses session={session} me={me}/>}
            </Col>
        </Row>
        </>)
    }
    else{
      return( <>
        <Navbar logout={()=>{setMe(null)}} logged_in={true} setsignin={setsignin}/>  
        <PageHeader extra={[<Dropdown  overlay={menustaff}><Button>Actions <DownOutlined /></Button></Dropdown>]} className="site-page-header" title={`Welcome Staff `} subTitle={`${me.properties.first_name} ${me.properties.last_name}`}/>,    
        <Row>
            <Col lg={{span:18,offset:3}}>
              {tab=="about_me"?<AboutMeStaff me={me}/>:<AllCoursesPage me={me} session={session}/>}
            </Col>
        </Row>
        </>)
    }
   
  } 
  return(
    <>
    <Navbar setsignin={setsignin}/>
    <LoginModal updateUser={setMe} minimize={()=>{setsignin(false)}} active={signin} session={session}/>
  </>
  )
 
 
}

export default App;
