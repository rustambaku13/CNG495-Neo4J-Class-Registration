import React from 'react';
import {Row,Col,Button} from 'antd';
export default function Navbar({setsignin,logged_in,logout}){

    return (
        <Row className="navbar" type='flex' justify="space-between" >
            <Col>
                <img alt="logo" height='70' src="https://www.metu.edu.tr/system/files/logo_orj/8/8.2.jpg"/>
            </Col>
            <Col>
                <h2 style={{"marginTop":"20px"}}>Course Registration System</h2>
            </Col>
            {logged_in? <Button onClick={logout} style={{"marginTop":"20px"}} type='ghost'>Log Out</Button>: <Button onClick={()=>{setsignin(true)}} style={{"marginTop":"20px"}} type='ghost'>Login</Button>}  
        </Row>
    )

}