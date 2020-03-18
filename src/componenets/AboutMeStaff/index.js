import React, { useEffect } from 'react';
import {Descriptions} from 'antd';
export default function AboutMeStaff({me}){
    
    return(
        <Descriptions bordered title="Staff Info">
            <Descriptions.Item label="Name">{me.properties.first_name}</Descriptions.Item>
            <Descriptions.Item label="Surname">{me.properties.last_name}</Descriptions.Item>
            <Descriptions.Item label="Id">{me.properties.id.toNumber()}</Descriptions.Item>
            <Descriptions.Item label="Nationality">{me.properties.nationality}</Descriptions.Item>
            <Descriptions.Item label="Address">
            {me.properties.address}
            </Descriptions.Item>
            <Descriptions.Item label="Position">
            {me.position} of {me.dept} Department
            </Descriptions.Item>
      </Descriptions>
    )
}